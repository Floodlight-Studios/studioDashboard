import {
    Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChange,
    ViewChild
} from 'angular2/core'
import {List, Map} from 'immutable';
import {BusinessModel} from "../../../business/BusinessModel";
import {OrderBy} from "../../../pipes/OrderBy";
import {SIMPLEGRID_DIRECTIVES, ISimpleGridEdit} from "../../simplegrid/SimpleGrid";
import {AppStore} from "angular2-redux-util/dist/index";
import {BusinessAction} from "../../../business/BusinessAction";
import {UserInfo} from "./UserInfo";
import {BusinessUser} from "../../../business/BusinessUser";
import {SimpleGridTable} from "../../simplegrid/SimpleGridTable";

@Component({
    selector: 'UsersDetails',
    changeDetection: ChangeDetectionStrategy.OnPush,
    directives: [SIMPLEGRID_DIRECTIVES, UserInfo],
    providers: [SIMPLEGRID_DIRECTIVES],
    pipes: [OrderBy],
    styles: [`
            .embossed {
                font-size: 7.2em;
                background-color: #666666;
                -webkit-background-clip: text;
                -moz-background-clip: text;
                background-clip: text;
                color: transparent;
                text-shadow: rgba(255,255,255,0.5) 0px 3px 3px;
                margin: 50px auto;
                text-align: center;
                opacity: 0.3;
              }
              .embossedSmaller {
                font-size: 2em !important;
                position: relative;;
                top: -60px;
                letter-spacing: -1px;
              }
              .disabled {
                 opacity: 0.2;
                 cursor: default;
              }
              .btns {
                 padding: 0 20px 20px 0px;
                 font-size: 1.4em;
                 color: #313131;
              }
              .btns:hover {
                color: red;
              }
    `],

    template: `    
    <div style="position: relative; top: 10px">
        <a class="btns" [ngClass]="{disabled: !simpleGridTable || simpleGridTable.getSelected() == null}" href="#"><span class="fa fa-plus"></span></a>
        <a class="btns" [ngClass]="{disabled: !simpleGridTable || simpleGridTable.getSelected() == null}" href="#"><span class="fa fa-rocket"></span></a>
        <a class="btns" [ngClass]="{disabled: !simpleGridTable || simpleGridTable.getSelected() == null}" href="#"><span class="fa fa-remove"></span></a>
        <a class="btns" [ngClass]="{disabled: !simpleGridTable || simpleGridTable.getSelected() == null}" href="#"><span class="fa fa-key"></span></a>
    </div>
    <br/>
    <div  *ngIf="!_businesses || _businesses.size == 0">
        <h1 class="embossed">USER DETAILS</h1>
        <h6 class="embossedSmaller embossed">select user(s) from the list to load up the related properties</h6>
    </div>
    <div *ngIf="_businesses && _businesses.size == 1">
        <UserInfo [user]="_businesses"></UserInfo>
    </div>
    <div *ngIf="_businesses && _businesses.size > 1">
         <simpleGridTable #userSimpleGridTable>
                <thead>
                <tr>
                  <th sortableHeader="name" [sort]="sort">name</th>
                  <th sortableHeader="businessId" [sort]="sort">business</th>
                  <th>privileges</th>
                  <th>access keys</th>
                </tr>
              </thead>
              <tbody>                                                                          
              <tr class="simpleGridRecord" [table]="userSimpleGridTable" simpleGridRecord *ngFor="#item of _businesses | OrderBy:sort.field:sort.desc; #index=index" [item]="item" [index]="index">
                    <td simpleGridData (labelEdited)="onLabelEdited($event,'name')" editable="true" field="name" [item]="item"></td>
                    <td simpleGridData field="businessId" [item]="item"></td>
                    <td simpleGridData field="privilegeId" [item]="item"></td>
                    <td simpleGridDataChecks field="accessMask" (changed)="setAccessMask($event)" [item]="item" [checkboxes]="getAccessMask(item)"></td>
                    <!--<td simpleGridData (labelEdited)="onLabelEdited($event,'maxMonitors')" editable="true" field="maxMonitors" [item]="item"></td>-->
                    <!-- <td simpleGridDataImage color="dodgerblue" [field]="item.getKey('studioLite') == '0' ? 'fa-circle' : 'fa-circle-o'" [item]="item"></td> -->
              </tr>
              </tbody>                 
        </simpleGridTable>
    </div>
    `
})

export class UsersDetails {
    public sort:{field: string, desc: boolean} = {field: null, desc: false};
    private _businesses:List<BusinessModel>;

    private onLabelEdited(event:ISimpleGridEdit, field) {
        var newValue = event.value;
        var businessUser:BusinessUser = event.item as BusinessUser;
        var oldValue = businessUser.getKey('name');
        var businessId = businessUser.getBusinessId();
        this.appStore.dispatch(this.businessActions.setBusinessUserField(businessId, field, {newValue, oldValue}));
    }

    @ViewChild(SimpleGridTable)
    simpleGridTable:SimpleGridTable

    @Input()
    set businesses(i_businesses) {
        this._businesses = i_businesses;
        if (this.simpleGridTable)
            this.simpleGridTable.deselect();
    }

    constructor(private appStore:AppStore, private businessActions:BusinessAction) {
    }

    private setAccessMask(event){
        var businessUser:BusinessUser = event.item as BusinessUser;
        var businessId = businessUser.getBusinessId();
        var name = businessUser.getName();
        var accessMask = event.value;
        var bits = [1, 2, 4, 8, 16, 32, 64, 128];
        var computedAccessMask = 0;
        accessMask.forEach(value=>{
            var bit = bits.shift();
            if (value)
                computedAccessMask = computedAccessMask + bit;

        })
        this.appStore.dispatch(this.businessActions.setBusinessUserField2(businessId, name, 'accessMask', computedAccessMask));
    }

    private getAccessMask(businessUser:BusinessUser) {
        var accessMask = businessUser.getAccessMask();
        var checks = List();
        var bits = [1, 2, 4, 8, 16, 32, 64, 128];
        bits.forEach((bit, idx) =>{
            let checked = (bit & accessMask) > 0 ? true : false;
            var checkBox = {
                'name': idx,
                'value': idx,
                'checked': checked
            }
            checks = checks.push(checkBox)
        })
        return checks;

    }
}







// var bits = [1, 2, 4, 8, 16, 32, 64, 128];
// total: 149 & number in offset 4
// self.m_WEEKDAYS.forEach(function (v, i) {
//     var n = weekDays & v;
//     if (n == v) {
//         $(elDays).find('input').eq(i).prop('checked', true);
//     } else {
//         $(elDays).find('input').eq(i).prop('checked', false);
//     }
// });
//
// var checks = [{
//     'name': '0',
//     'value': '0',
//     'checked': true
// }, {
//     'name': '1',
//     'value': '1',
//     'checked': false
// }];
//return List(checks);