import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from 'angular2/core'
import {CanActivate, ComponentInstruction} from "angular2/router";
import {AuthService} from "../../../services/AuthService";
import {appInjService} from "../../../services/AppInjService";
import {AppModel} from "../../../reseller/AppModel";
import {List} from 'immutable';
import {AppStore} from "angular2-redux-util/dist/index";
import {ResellerAction} from "../../../reseller/ResellerAction";
import {SIMPLEGRID_DIRECTIVES} from "../../simplegrid/SimpleGrid";
import {OrderBy} from "../../../pipes/OrderBy";

@Component({
    selector: 'apps',
    pipes: [OrderBy],
    directives: [SIMPLEGRID_DIRECTIVES],
    template: `
        <div *ngIf="apps && apps.size > 0">
          <simpleGridTable #userSimpleGridTable>
            <thead>
            <tr>
              <th>icon</th>
              <th sortableHeader="appName" [sort]="sort">app name</th>
              <th>available (off | on)</th>
            </tr>
            </thead>
            <tbody>
            <tr class="simpleGridRecord" [table]="userSimpleGridTable" simpleGridRecord *ngFor="#item of apps | OrderBy:sort.field:sort.desc; #index=index" [item]="item" [index]="index">
              <td style="width: 10%" simpleGridDataImage color="dodgerblue" [field]="item.getIcon(item)" [item]="item"></td> 
              <td style="width: 70%" simpleGridData field="appName" [item]="item"></td>
              <td style="width: 20%" simpleGridDataChecks slideMode="true" [item]="item" [checkboxes]="getInstalledStatus(item)" (changed)="onAppInstalledChange($event,index)"></td>
            </tr>
            </tbody>
          </simpleGridTable>
        </div>
    `,
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

    private sort:{field:string, desc:boolean} = {field: null, desc: false};
    private apps:List<AppModel>;
    private unsub;

    private getInstalledStatus(item:AppModel){
        return [Number(item.getInstalled())];
    }

    private onAppInstalledChange(event,index){
        console.log(event + index);
    }

    private ngOnDestroy() {
        this.unsub();
    }

}

