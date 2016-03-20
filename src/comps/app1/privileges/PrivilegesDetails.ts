import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from 'angular2/core'
import {PrivelegesModel} from "../../../reseller/PrivelegesModel";
import {List, Map} from 'immutable';
import {SIMPLEGRID_DIRECTIVES} from "../../simplegrid/SimpleGrid";
import {AppStore} from "angular2-redux-util/dist/index";
import {PrivelegesTemplateModel} from "../../../reseller/PrivelegesTemplateModel";
const _ = require('underscore');

enum PrivModeEnum {ADD, DEL, UPD}

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
                        <tr class="simpleGridRecord" *ngFor="#item of renderPrivilegesTable(privilegesItem); #index=index">
                            <td style="width: 70%" [editable]="false" simpleGridData [processField]="renderTableName()" [item]="item"></td>
                            <td style="width: 10%" (changed)="onChange($event)" [item]="{item: privilegesItem, index: index, PrivModeEnum: PrivModeEnum.DEL}" simpleGridDataChecks [checkboxes]="renderPrivilegesChecks(privilegesItem, index, PrivModeEnum.DEL)"></td>
                            <td style="width: 10%" (changed)="onChange($event)" [item]="{item: privilegesItem, index: index, PrivModeEnum: PrivModeEnum.ADD}" simpleGridDataChecks [checkboxes]="renderPrivilegesChecks(privilegesItem, index, PrivModeEnum.ADD)"></td>
                            <td style="width: 10%" (changed)="onChange($event)" [item]="{item: privilegesItem, index: index, PrivModeEnum: PrivModeEnum.UPD}" simpleGridDataChecks [checkboxes]="renderPrivilegesChecks(privilegesItem, index, PrivModeEnum.UPD)"></td>
                        </tr>
                    </tbody>
                </simpleGridTable>
              </div>      
          </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrivilegesDetails {

    private PrivModeEnum = PrivModeEnum;

    constructor(private appStore:AppStore) {
        var i_reseller = this.appStore.getState().reseller;

        this.m_privelegesSystemModelList = i_reseller.getIn(['privilegesSystem']);
        this.unsub = this.appStore.sub((privelegesSystemModel:List<PrivelegesTemplateModel>) => {
            this.m_privelegesSystemModelList = privelegesSystemModel;
        }, 'reseller.privilegesSystem');
    }

    private unsub;
    private m_privileges:List<PrivelegesModel>
    private m_privelegesSystemModelList:List<PrivelegesTemplateModel>

    @Input()
    selected:PrivelegesModel;

    @Input()
    set priveleges(i_privileges:List<PrivelegesModel>) {
        this.m_privileges = i_privileges;
    }

    private onChange(event){
        console.log('on checkbox ' + event);
    }

    private renderPrivilegesTable(privelegesSystemModel:PrivelegesTemplateModel):Map<string,any> {
        return privelegesSystemModel.getColumns();
    }

    private renderTableName() {
        return (field) => {
            return field[0];
        }
    }

    private renderPrivilegesChecks(i_privelegesSystemModel:PrivelegesTemplateModel, index, privModeEnum:PrivModeEnum):Array<number> {
        var tableName:string = i_privelegesSystemModel.getTableName();
        var selColumn = this.selected.getColumns();
        selColumn = selColumn.find((k)=>{
            if (k.tableName == tableName)
                return true;
        })

        // if selColumn does not exist it means a new field privilege table has been added
        // so on the next save it will be added to our config, we just set it to checked [x] by default on UI
        if (!selColumn)
            return [1]

        var selColumnsJs = selColumn.columns.toJS();
        var selColumnsPairs = _.pairs(selColumnsJs);
        var finalColumn = selColumnsPairs[index];
        var bit;
        switch (privModeEnum){
            case PrivModeEnum.UPD: {
                bit = 1;
                break;
            }
            case PrivModeEnum.ADD: {
                bit = 2;
                break;
            }
            case PrivModeEnum.DEL: {
                bit = 4;
                break;
            }
        }
        var result = bit & finalColumn[1];
        return [result];
    }

    private ngOnDestroy() {
        this.unsub();
    }

}


// var allColumns:Map<string,any> = i_privelegesSystemModel.getColumns();
// var allColumnsJs = allColumns.toJS();
// var allColumnsPairs = _.pairs(allColumnsJs);
// var src = allColumnsPairs[index];