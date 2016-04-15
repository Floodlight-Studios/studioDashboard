import {Component} from 'angular2/core'
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
import {CreditService} from "../../../services/CreditService";
const _ = require('underscore');
const bootbox = require('bootbox');

// Recurring table:
//================
// recurringMode:"value"
//      0 = disabled
//      1 = CC
//      2 = PayPal
// paymentStatus:"value"
//      0 = failed
//      1 = passed
// accountStatus:"value"
//      0 = not verified
//      1 = intermediate state while the account is been created
//      2 = account is created
//      3 = intermediate state
//      4 = account paid
// lastPayment:"4/12/2016 12:00:00 AM"
//      date

@Component({
    selector: 'accounts',
    providers: [CreditService],
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

    constructor(private creditService:CreditService, private appStore:AppStore, private fb:FormBuilder, private resellerAction:ResellerAction) {
        var i_reseller = this.appStore.getState().reseller;
         var a = creditService.validateCardNumber('5418426187097565');
         var b = creditService.validateCardExpiry('10','15');
         var b = creditService.validateCardCVC(123,'visa');
         var b = creditService.parseCardType('5418426187097565');
         var b = creditService.parseCardExpiry('10/2016');
         var b = creditService.formatCardNumber('5418 4261 8709 7565');
         var b = creditService.formatCardNumber('5418-4261-8709 7565');
         var b = creditService.formatCardExpiry('1/16');

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
        index: 1,
        icon: 'fa-credit-card-alt',
        name: 'credit card'
    }, {
        index: 2,
        icon: 'fa-cc-paypal',
        name: 'paypal'
    },{
        index: 0,
        icon: 'fa-times-circle',
        name: 'disable'
    }]

    private userName = '';
    private businessId = '';
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
        this.businessId = this.appStore.getState().reseller.getIn(['whitelabel']).getKey('businessId');

        this.accountModels.forEach((accountModel:AccountModel)=> {
            var type:string = accountModel.getType().toLowerCase();
            switch (type) {
                case 'shipping':
                {
                }
                case 'billing':
                {
                    _.forEach(this.formInputs, (value, key:string)=> {
                        if (_.isUndefined(key))
                            return;
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

    private getAccountModelKey(modelType, key) {
        var result = '';
        if (!this.accountModels)
            return result;
        this.accountModels.forEach((accountModel:AccountModel)=> {
            var t = accountModel.getType();
            if (accountModel.getType() == modelType && result == ''){
                var a = accountModel.getKey(key);
                return result = a;
            }

        });
        return result;
    }

    private getRecurring(key):any {
        var result:string = '';
        if (!this.accountModels)
            return result;
        result = this.getAccountModelKey('Recurring', key);
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

    private getSelectedPayment(i_recurringMode) {
        var recurringMode = this.getAccountModelKey('Recurring', 'recurringMode');
        if (i_recurringMode.index == recurringMode)
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