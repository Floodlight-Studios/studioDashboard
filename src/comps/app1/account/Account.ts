import {Component, ChangeDetectionStrategy, NgZone} from 'angular2/core'
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
const _ = require('underscore');
const bootbox = require('bootbox');

@Component({
    selector: 'accounts',
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

    constructor(private appStore:AppStore, private fb:FormBuilder, private router:Router, private zone:NgZone, private resellerAction:ResellerAction) {
        var i_reseller = this.appStore.getState().reseller;
        this.whitelabelModel = i_reseller.getIn(['whitelabel']);
        this.unsub = this.appStore.sub((whitelabelModel:WhitelabelModel) => {
            this.whitelabelModel = whitelabelModel;
            this.renderFormInputs();
        }, 'reseller.whitelabel');

        this.contGroup = fb.group({
            'billing_companyName': ['']
        });
        _.forEach(this.contGroup.controls, (value, key:string)=> {
            this.formInputs[key] = this.contGroup.controls[key] as Control;
        })
        this.renderFormInputs();
    }

    private whiteLabelEnabled:boolean = true;
    private formInputs = {};
    private contGroup:ControlGroup;
    private whitelabelModel:WhitelabelModel;
    private PAY_SUBSCRIBER:number = 4;
    private unsub;


    private onInputBlur(event) {
        this.contGroup.value
        //var table = event.split('_')[0];
        // var value = event.split('_')[1];
        // setTimeout(()=>this.appStore.dispatch(this.resellerAction.updateAccountInfo({table, value}), 1);

        // setTimeout(()=>this.appStore.dispatch(this.resellerAction.updateAccountInfo(this.contGroup.value)), 1);
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
        this.whiteLabelEnabled = this.whitelabelModel.getKey('whitelabelEnabled');
        ;
        _.forEach(this.formInputs, (value, key:string)=> {
            var value = this.whitelabelModel.getKey(key);
            this.formInputs[key].updateValue(value);
        })
    };

    private onWhiteLabelChange(value) {
        value = value ? 1 : 0;
        this.appStore.dispatch(this.resellerAction.updateResellerInfo({whitelabelEnabled: value}))
    }

    private ngOnDestroy() {
        this.unsub();
    }
}