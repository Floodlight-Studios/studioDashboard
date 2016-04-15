import {Component, ElementRef, NgZone} from 'angular2/core'
import {Router} from 'angular2/router';
import {CanActivate, ComponentInstruction} from "angular2/router";
import {AuthService} from "../../../services/AuthService";
import {appInjService} from "../../../services/AppInjService";
import {Tab} from "../../tabs/tab";
import {Tabs} from "../../tabs/tabs";
import {WhitelabelModel} from "../../../reseller/WhitelabelModel";
import {ResellerAction} from "../../../reseller/ResellerAction";
import {AppStore} from "angular2-redux-util/dist/index";
import {FORM_DIRECTIVES, ControlGroup, FormBuilder, Control} from "angular2/common";
import {BlurForwarder} from "../../blurforwarder/BlurForwarder";
import {Loading} from "../../loading/Loading";
import {List} from "immutable";
import {AccountModel} from "../../../reseller/AccountModel";
const _ = require('underscore');
const bootbox = require('bootbox');

@Component({
    selector: 'accounts',
    styles: [`
        .faded {
            opacity: 0.4;
        }
    `],
    directives: [Tab, Tabs, FORM_DIRECTIVES, BlurForwarder, Loading],
    host: {
        '(input-blur)': 'onInputBlur($event)'
    },
    // changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: `/src/comps/app1/account/Account.html`
})
@CanActivate((to:ComponentInstruction, from:ComponentInstruction) => {
    let authService:AuthService = appInjService().get(AuthService);
    return authService.checkAccess(to, from, ['/Login/Login']);
})
export class Account {

    constructor(private el:ElementRef, private appStore:AppStore, private fb:FormBuilder, private router:Router, private zone:NgZone, private resellerAction:ResellerAction) {
        var i_reseller = this.appStore.getState().reseller;

        /** Whitelabel **/
        this.whitelabelModel = i_reseller.getIn(['whitelabel']);
        this.unsub = this.appStore.sub((whitelabelModel:WhitelabelModel) => {
            this.whitelabelModel = whitelabelModel;
            //this.renderFormInputs();
        }, 'reseller.whitelabel');

        /** Accounts **/
        this.accountModels = i_reseller.getIn(['accounts']);
        this.renderFormInputs();
        this.unsub = this.appStore.sub((accountModels:List<AccountModel>) => {
            this.accountModels = accountModels;
            this.renderFormInputs();
        }, 'reseller.accounts');

        this.contGroup = fb.group({
            'enterprise_login': [''],
            'enterprise_pass1': [''],
            'enterprise_pass2': [''],
            'billing_cardNumber': [''],
            'billing_expirationMonth': [''],
            'billing_expirationYear': [''],
            'billing_securityCode': [''],
            'billing_firstName': [''],
            'billing_lastName': [''],
            'billing_address1': [''],
            'billing_address2': [''],
            'billing_city': [''],
            'billing_state': [''],
            'billing_country': [''],
            'billing_zipCode': [''],
            'billing_workPhone': [''],
            'billing_cellPhone': [''],
            'billing_email': [''],
            'shipping_firstName': [''],
            'shipping_lastName': [''],
            'shipping_address1': [''],
            'shipping_address2': [''],
            'shipping_city': [''],
            'shipping_state': [''],
            'shipping_country': [''],
            'shipping_zipCode': [''],
            'shipping_workPhone': [''],
            'shipping_cellPhone': [''],
            'shipping_email': ['']
        });
        _.forEach(this.contGroup.controls, (value, key:string)=> {
            this.formInputs[key] = this.contGroup.controls[key] as Control;
        })
        this.renderFormInputs();
    }

    private payments = [{
        icon: 'fa-times-circle',
        name: 'disable'
    }, {
        icon: 'fa-credit-card-alt',
        name: 'paypal'
    }, {
        icon: 'fa-cc-paypal',
        name: 'credit card'
    }]

    private userName = '';
    private whiteLabelEnabled:boolean = true;
    private formInputs = {};
    private contGroup:ControlGroup;
    private whitelabelModel:WhitelabelModel;
    private accountModels:List<AccountModel>;
    private PAY_SUBSCRIBER:number = 4;
    private unsub;


    private onInputBlur(event) {
        setTimeout(()=>console.log(JSON.stringify(this.contGroup.value)), 1);
        setTimeout(()=>this.appStore.dispatch(this.resellerAction.updateAccountInfo(this.contGroup.value)), 1);
    }

    private onSubmit(value) {
        setTimeout(()=>console.log(JSON.stringify(this.contGroup.value)), 1);
    }

    private onChangeAccountStatus(status:boolean) {
        if (!status) {
            bootbox.prompt(`are you sure you want to cancel your current subscription? 
            Dangerous: type [DELETE_NOW] to cancel association of all your screens`, (result) => {
                if (result == 'DELETE_NOW') {
                    this.appStore.dispatch(this.resellerAction.updateResellerInfo({accountStatus: 0}));
                }
            });
        } else {
            //todo: check if CC info available before re-enabling customer
            this.appStore.dispatch(this.resellerAction.updateResellerInfo({accountStatus: this.PAY_SUBSCRIBER}));
        }
    }

    private getAccountStatus():boolean {
        if (this.whitelabelModel && this.whitelabelModel.getAccountStatus() == this.PAY_SUBSCRIBER) {
            return true;
        } else {
            return false;
        }
    }

    private renderFormInputs() {
        if (!this.accountModels)
            return;

        this.userName = this.appStore.getState().appdb.getIn(['credentials']).get('user');

        this.accountModels.forEach((accountModel:AccountModel)=> {
            var type:string = accountModel.getType().toLowerCase();
            switch (type) {
                case 'shipping':
                {
                }
                case 'billing':
                {
                    _.forEach(this.formInputs, (value, key:string)=> {
                        var table = key.split('_')[0];
                        if (table == type) {
                            var field = key.split('_')[1];
                            var data = accountModel.getKey(field);
                            this.formInputs[key].updateValue(data);
                        }
                    })
                    break;
                }
                case 'recurring':
                {
                    break;
                }
                case 'contact':
                {
                    break;
                }
            }
        })
    };

    private getAccountModel(modelType, key) {
        var result = '';
        if (!this.accountModels)
            return result;
        this.accountModels.forEach((accountModel:AccountModel)=> {
            if (accountModel.getType() == modelType && result == '')
                result = accountModel.getKey(key);
        });
        return result;
    }

    // recurringMode
    // 0 = disabled
    // 1 = CC
    // 2 = PayPal
    private getRecurring(key):any {
        var result:string = '';
        if (!this.accountModels)
            return result;
        result = this.getAccountModel('Recurring', key);
        // this.accountModels.forEach((accountModel:AccountModel)=> {
        //     if (accountModel.getType() == 'Recurring' && result == '')
        //         result = accountModel.getKey(key);
        // });
        if (_.isUndefined(result))
            return '----';
        if (key == 'lastPayment' && result != '')
            return result.split(' ')[0];
        if (key == 'paymentStatus' && result != '')
            return (result == '1' ? true : false);
        if (key == 'recurringMode' && result != '')
            return result = this.payments[result];
        return result;
    }

    private onPaymentChanged(event) {
    }

    private getSelectedPayment(i_paymentMethod) {
        return 'selected';
        var paymentMethod = this.getAccountModel('recurringMode', 'paymentMethod');
        if (i_paymentMethod.toLowerCase().trim() == paymentMethod.toLowerCase().trim())
            return 'selected';
    }

    private onWhiteLabelChange(value) {
        value = value ? 1 : 0;
        this.appStore.dispatch(this.resellerAction.updateResellerInfo({whitelabelEnabled: value}))
    }

    private ngOnDestroy() {
        this.unsub();
    }
}