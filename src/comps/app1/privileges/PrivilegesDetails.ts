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
          <div *ngIf="!m_privelegesSystemModelList || !selected">
            <center>
              <h3>select | create privileges</h3>
            </center>
          </div>
          <div *ngIf="m_privelegesSystemModelList && selected">
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
                        <tr class="simpleGridRecord" [table]="userSimpleGridTable" simpleGridRecord *ngFor="#item of processPrivilegesTable(privilegesItem); #index=index" [item]="item" [index]="index" [selectable]="false">
                            <td style="width: 70%" [editable]="false" simpleGridData [processField]="processTableName()" [item]="item"></td>
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
    selected:PrivelegesModel;

    @Input()
    set priveleges(i_privileges:List<PrivelegesModel>) {
        this.m_privileges = i_privileges;
    }

    private processPrivilegesTable(privelegesSystemModel:PrivelegesSystemModel):Map<string,any> {
        return privelegesSystemModel.getColumns();
    }

    private processTableName() {
        return (field) => {
            return field[0];
        }
    }

    private getPrivilegesChecks(i_privelegesSystemModel:PrivelegesSystemModel) {
        let tableName = i_privelegesSystemModel.getTableName();
        let selectedGroups = this.selected.getData().get('groups');
        console.log('getPrivilegesChecks ' + i_privelegesSystemModel + ' ' + this.selected);
        return [0];
    }

    private ngOnDestroy() {
        this.unsub();
    }

}

