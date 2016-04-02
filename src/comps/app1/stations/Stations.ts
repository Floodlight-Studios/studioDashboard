import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef} from 'angular2/core'
import {CanActivate, ComponentInstruction} from "angular2/router";
import {AuthService} from "../../../services/AuthService";
import {appInjService} from "../../../services/AppInjService";
import {AppModel} from "../../../reseller/AppModel";
import {List} from 'immutable';
import {AppStore} from "angular2-redux-util/dist/index";
import {ResellerAction} from "../../../reseller/ResellerAction";
import {SIMPLEGRID_DIRECTIVES} from "../../simplegrid/SimpleGrid";
import {OrderBy} from "../../../pipes/OrderBy";
import {StationsAction} from "../../../stations/StationsAction";

@Component({
    selector: 'stations',
    pipes: [OrderBy],
    directives: [SIMPLEGRID_DIRECTIVES],
    template: `
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
@CanActivate((to:ComponentInstruction, from:ComponentInstruction) => {
    let authService:AuthService = appInjService().get(AuthService);
    return authService.checkAccess(to, from, ['/Login/Login']);
})
export class Stations {

    constructor(private appStore:AppStore, private stationsAction:StationsAction) {
        this.appStore.dispatch(this.stationsAction.getStationsInfo('111'));
    }


}

