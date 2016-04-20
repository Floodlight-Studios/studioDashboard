import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from 'angular2/core'
import {PrivelegesModel} from "../../../reseller/PrivelegesModel";
import {List, Map} from 'immutable';
import {SIMPLEGRID_DIRECTIVES} from "../../simplegrid/SimpleGrid";
import {AppStore} from "angular2-redux-util/dist/index";
import {PrivelegesTemplateModel} from "../../../reseller/PrivelegesTemplateModel";
import {ResellerAction} from "../../../reseller/ResellerAction";
import {Lib} from "../../../Lib";
const _ = require('underscore');

enum PrivModeEnum {ADD, DEL, UPD}

@Component({
    selector: 'privilegesDetails',
    directives: [SIMPLEGRID_DIRECTIVES],
    styles: [`
        .btn-outlined {
            position: relative;
            top: 28px;
            border-radius: 0;
            -webkit-transition: all 0.3s;
               -moz-transition: all 0.3s;
                    transition: all 0.3s;
        }
    `],
    template: `
          <div *ngIf="!m_privelegesSystemModelList || !m_selected">
            <center>
              <h3>select | create privileges</h3>
            </center>
          </div>
          <div *ngIf="m_privelegesSystemModelList && m_selected">
              <div *ngFor="#privilegesItem of m_privelegesSystemModelList">
                <hr/>
                <h3>{{privilegesItem.getTableName()}}</h3>
                <a *ngFor="#groupAttribute of privilegesItem.getGroupAttributes(privilegesItem, groupAttribute)" 
                  (click)="updatePrivilegesGroupAttributes($event, privilegesItem, groupAttribute)"
                  href="#" class="btn btn-outlined btn-xs {{renderPrivilegesGroupAttributes(privilegesItem, groupAttribute)}}"
                  role="button">{{groupAttribute}}
                </a>
                <simpleGridTable #userSimpleGridTable>
                    <thead>
                        <tr>
                          <th></th>
                          <th>delete</th>
                          <th>add</th>
                          <th>update</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="simpleGridRecord" *ngFor="#item of renderPrivilegesTable(privilegesItem); #index=index">
                            <td style="width: 70%" [editable]="false" simpleGridData [processField]="renderTableName()" [item]="item"></td>
                            <td style="width: 10%" (changed)="onPrivilegeChange($event)" [item]="{item: privilegesItem, index: index, PrivModeEnum: PrivModeEnum.DEL}" simpleGridDataChecks [checkboxes]="renderPrivilegesChecks(privilegesItem, index, PrivModeEnum.DEL)"></td>
                            <td style="width: 10%" (changed)="onPrivilegeChange($event)" [item]="{item: privilegesItem, index: index, PrivModeEnum: PrivModeEnum.ADD}" simpleGridDataChecks [checkboxes]="renderPrivilegesChecks(privilegesItem, index, PrivModeEnum.ADD)"></td>
                            <td style="width: 10%" (changed)="onPrivilegeChange($event)" [item]="{item: privilegesItem, index: index, PrivModeEnum: PrivModeEnum.UPD}" simpleGridDataChecks [checkboxes]="renderPrivilegesChecks(privilegesItem, index, PrivModeEnum.UPD)"></td>
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

    constructor(private appStore:AppStore, private resellerAction:ResellerAction) {
        var i_reseller = this.appStore.getState().reseller;

        this.m_privelegesSystemModelList = i_reseller.getIn(['privilegesSystem']);
        this.unsub = this.appStore.sub((privelegesSystemModel:List<PrivelegesTemplateModel>) => {
            this.m_privelegesSystemModelList = privelegesSystemModel;
        }, 'reseller.privilegesSystem');
    }

    private unsub;
    private m_selected:PrivelegesModel;
    // private m_privileges:List<PrivelegesModel>
    private m_privelegesSystemModelList:List<PrivelegesTemplateModel>

    @Input()
    set selected(i_selected:PrivelegesModel) {
        this.m_selected = i_selected;
    }

    // @Input()
    // set priveleges(i_privileges:List<PrivelegesModel>) {
    //     this.m_privileges = i_privileges;
    // }

    private calcMask(i_privModeEnum, i_adding, i_totalBits) {

        switch (i_privModeEnum) {
            case PrivModeEnum.UPD:
            {
                if (i_adding) {
                    return 1;
                } else {
                    return 0;
                }
            }
            case PrivModeEnum.ADD:
            {
                if (i_adding) {
                    return 3;
                } else {
                    return 1;
                }
            }
            case PrivModeEnum.DEL:
            {
                if (i_adding) {
                    return 7;
                } else {
                    return i_totalBits - 4;

                }
            }
        }
    }

    private renderPrivilegesTable(privelegesSystemModel:PrivelegesTemplateModel):Map<string,any> {
        return privelegesSystemModel.getColumns();
    }

    private renderTableName() {
        return (field) => {
            return field[0];
        }
    }

    private updatePrivilegesGroupAttributes(event, i_privelegesSystemModel:PrivelegesTemplateModel, privelegesAttribute:string):void {
        event.preventDefault();
        let privelegesId = this.m_selected.getPrivelegesId();
        let selPrivName = this.m_selected.getName();
        var tableName = i_privelegesSystemModel.getTableName();
        var selColumn = this.m_selected.getColumns();
        selColumn = selColumn.find((k)=> {
            if (k.get('tableName') == tableName)
                return true;
        })
        var value = !Lib.BooleanToNumber(selColumn.get(privelegesAttribute));
        var payload = {
            privelegesId,
            selPrivName,
            privelegesAttribute,
            tableName,
            value
        }
        this.appStore.dispatch(this.resellerAction.updatePrivilegeAttribute(payload));
        this.appStore.dispatch(this.resellerAction.savePrivileges(privelegesId, selPrivName));
    }

    private onPrivilegeChange(event:{ value:Array<number>, item:{ PrivModeEnum:PrivModeEnum, index:number, item:PrivelegesTemplateModel } }) {

        let selPrivName = this.m_selected.getName();
        let privelegesId = this.m_selected.getPrivelegesId();
        let index:number = event.item.index;
        let adding:boolean = Boolean(event.value[0]);
        let tableName:string = event.item.item.getTableName();
        let privModeEnum:PrivModeEnum = event.item.PrivModeEnum;

        var selColumn = this.m_selected.getColumns();
        selColumn = selColumn.find((k)=> {
            if (k.get('tableName') == tableName)
                return true;
        })
        var totalBits = Number(Lib.MapOfIndex(selColumn.get('columns'), index, 'last'));

        var updTotalBits = this.calcMask(privModeEnum, adding, totalBits);

        var payload = {
            privelegesId,
            selPrivName,
            tableName,
            index,
            privModeEnum,
            updTotalBits
        }
        this.appStore.dispatch(this.resellerAction.updatePrivilegesSystem(payload))
        this.appStore.dispatch(this.resellerAction.savePrivileges(privelegesId, selPrivName));
    }

    private renderPrivilegesGroupAttributes(i_privelegesSystemModel:PrivelegesTemplateModel, i_privelegesAttribute:string):string {
        var tableName = i_privelegesSystemModel.getTableName();
        var selColumn = this.m_selected.getColumns();
        selColumn = selColumn.find((k)=> {
            if (k.get('tableName') == tableName)
                return true;
        })
        if (selColumn.get(i_privelegesAttribute) == '1')
            return 'btn-primary';
        return 'btn-secondary';
    }

    private renderPrivilegesChecks(i_privelegesSystemModel:PrivelegesTemplateModel, index, privModeEnum:PrivModeEnum):Array<number> {
        var tableName:string = i_privelegesSystemModel.getTableName();
        var selColumn = this.m_selected.getColumns();


        selColumn = selColumn.find((k)=> {
            if (k.get('tableName') == tableName)
                return true;
        })

        // if selColumn does not exist it means a new field privilege table has been added
        // so on the next save it will be added to our config, we just set it to checked [x] by default on UI
        if (!selColumn)
            return [1]
        var totalBits = Number(Lib.MapOfIndex(selColumn.get('columns'), index, 'last'));
        var bit;
        switch (privModeEnum) {
            case PrivModeEnum.UPD:
            {
                bit = 1;
                break;
            }
            case PrivModeEnum.ADD:
            {
                bit = 2;
                break;
            }
            case PrivModeEnum.DEL:
            {
                bit = 4;
                break;
            }
        }
        var result = bit & totalBits;
        return [result];
    }

    private ngOnDestroy() {
        this.unsub();
    }

}