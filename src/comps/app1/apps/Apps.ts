import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from 'angular2/core'
import {CanActivate, ComponentInstruction} from "angular2/router";
import {AuthService} from "../../../services/AuthService";
import {appInjService} from "../../../services/AppInjService";
import {AppModel} from "../../../reseller/AppModel";
import {List} from 'immutable';
import {AppStore} from "angular2-redux-util/dist/index";
import {ResellerAction} from "../../../reseller/ResellerAction";

@Component({
    selector: 'apps',
    template: `<h3>Apps coming soon...</h3>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
@CanActivate((to:ComponentInstruction, from:ComponentInstruction) => {
    let authService:AuthService = appInjService().get(AuthService);
    return authService.checkAccess(to, from, ['/Login/Login']);
})
export class Apps {

    constructor(private appStore:AppStore, private resellerAction:ResellerAction) {
        var i_reseller = this.appStore.getState().reseller;

        this.apps = i_reseller.getIn(['apps']);
        this.unsub = this.appStore.sub((apps) => {
            this.apps = apps;
        }, 'reseller.apps');

    }

    private apps:List<AppModel>;
    private unsub;

    private ngOnDestroy() {
        this.unsub();
    }

}

