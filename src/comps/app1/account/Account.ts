import {Component, ChangeDetectionStrategy, ChangeDetectorRef, ApplicationRef, NgZone} from 'angular2/core'
import {CanActivate, ComponentInstruction} from "angular2/router";
import {AuthService} from "../../../services/AuthService";
import {appInjService} from "../../../services/AppInjService";
import {ResellerAction} from "../../../reseller/ResellerAction";
import {FormBuilder, ControlGroup} from "angular2/common";
import {AppStore} from "angular2-redux-util/dist/index";
import {WhitelabelModel} from "../../../reseller/WhitelabelModel";

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
    changeDetection: ChangeDetectionStrategy.OnPush,
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
    private unsub;

    private getAccountStatus():boolean {
        if (this.whitelabelModel.getAccountStatus() == 4) {
            return true;
        } else {
            return false;
        }
    }

    private ngOnDestroy() {
        this.unsub();
    }

}

