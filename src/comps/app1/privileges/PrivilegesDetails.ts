import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from 'angular2/core'
import {PrivelegesModel} from "../../../reseller/PrivelegesModel";
import {List} from 'immutable';
import {SIMPLEGRID_DIRECTIVES} from "../../simplegrid/SimpleGrid";
import {AppStore} from "angular2-redux-util/dist/index";
import {PrivelegesSystemModel} from "../../../reseller/PrivelegesSystemModel";

@Component({
    selector: 'privilegesDetails',
    directives: [SIMPLEGRID_DIRECTIVES],
    template: `
          <div *ngIf="m_privelegesSystemModelList">
              <div *ngFor="#privilegesItem of m_privelegesSystemModelList">
                <simpleGridTable #userSimpleGridTable>
                    <thead>
                        <tr>
                          <th>{{privilegesItem.getTableName() }}</th>
                          <th>delete</th>
                          <th>add</th>
                          <th>update</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="simpleGridRecord" [table]="userSimpleGridTable" simpleGridRecord *ngFor="#item of processPrivilegesTable(privilegesItem); #index=index" [item]="item" [index]="index">
                            <td style="width: 70%" simpleGridData [processField]="processTableName()" [item]="item"></td>
                            <td style="width: 10%" simpleGridDataChecks [checkboxes]="getPrivilegesChecks(privilegesItem)"></td>
                            <td style="width: 10%" simpleGridDataChecks [checkboxes]="getPrivilegesChecks(privilegesItem)"></td>
                            <td style="width: 10%" simpleGridDataChecks [checkboxes]="getPrivilegesChecks(privilegesItem)"></td>
                            <!--<td style="width: 20%" simpleGridDataChecks (changed)="setAccessMask($event)" [item]="item" [checkboxes]="getAccessMask(item)"></td>-->
                        </tr>
                    </tbody>
                </simpleGridTable>
              </div>      
          </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrivilegesDetails {

    constructor(private appStore:AppStore) {
        var i_reseller = this.appStore.getState().reseller;

        this.m_privelegesSystemModelList = i_reseller.getIn(['privilegesSystem']);
        this.unsub = this.appStore.sub((privelegesSystemModel:List<PrivelegesSystemModel>) => {
            this.m_privelegesSystemModelList = privelegesSystemModel;
        }, 'reseller.privilegesSystem');
    }

    private unsub;
    private m_privileges:List<PrivelegesModel>
    private m_privelegesSystemModelList:List<PrivelegesSystemModel>

    @Input()
    set priveleges(i_privileges:List<PrivelegesModel>) {
        this.m_privileges = i_privileges;
        // if (i_businesses && this.simpleGridTable && this.m_businesses.size != this.totalBusinessSelected) {
        //     this.simpleGridTable.deselect();
        //     this.totalBusinessSelected = this.m_businesses.size;
        // }
    }

    private processPrivilegesTable(privelegesSystemModel:PrivelegesSystemModel):Map<string,any> {
        return privelegesSystemModel.getColumns();
        // var columns:Map<string,any> = privelegesSystemModel.getColumns();
        // columns.forEach((k,v)=>{
        //     console.log(k,v);
        // })
        // return [1,2,3,4];
    }

    private processTableName() {
        return (field) => {
            return field[0];
        }
    }

    private getPrivilegesChecks(item) {
        return [1];
    }

    private ngOnDestroy() {
        this.unsub();
    }

}

