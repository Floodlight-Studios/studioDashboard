import {Component, ChangeDetectionStrategy, ChangeDetectorRef, ApplicationRef, NgZone} from 'angular2/core'
import {CanActivate, ComponentInstruction} from "angular2/router";
import {AuthService} from "../../../services/AuthService";
import {appInjService} from "../../../services/AppInjService";
import {ResellerAction} from "../../../reseller/ResellerAction";
import {FormBuilder, ControlGroup} from "angular2/common";
import {AppStore} from "angular2-redux-util/dist/index";
import {WhitelabelModel} from "../../../reseller/WhitelabelModel";
const bootbox = require('bootbox');

@Component({
    selector: 'accounts',
    styles: [`
    hr {
        display: block;
        height: 1px;
        border: 0;
        border-top: 1px solid #ccc;
        margin: 2em 0em;
        padding: 0; 
    }
    `],
    // changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: `/src/comps/app1/account/Account.html`
})
@CanActivate((to:ComponentInstruction, from:ComponentInstruction) => {
    let authService:AuthService = appInjService().get(AuthService);
    return authService.checkAccess(to, from, ['/Login/Login']);
})
export class Account {

    constructor(private appStore:AppStore, private fb:FormBuilder, private resellerAction:ResellerAction) {
        var i_reseller = this.appStore.getState().reseller;
        this.whitelabelModel = i_reseller.getIn(['whitelabel']);
        this.unsub = this.appStore.sub((whitelabelModel:WhitelabelModel) => {
            this.whitelabelModel = whitelabelModel;
        }, 'reseller.whitelabel');
    }

    private contGroup:ControlGroup;
    private whitelabelModel:WhitelabelModel;
    private PAY_SUBSCRIBER:number = 4;
    private unsub;

    private onChangeAccountStatus(status:boolean) {
        if (!status) {
            bootbox.prompt(`are you sure you want to cancel your current subscription? 
            Dangerous: type [DELETE_NOW] to cancel association of all your screens`, (result) => {
                if (result=='DELETE_NOW') {
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

    private ngOnDestroy() {
        this.unsub();
    }

}

