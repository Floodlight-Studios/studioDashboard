import {Component, Input, ChangeDetectionStrategy, ViewChild} from 'angular2/core'
import {List, Map} from 'immutable';
import {BusinessModel} from "../../../business/BusinessModel";
import {OrderBy} from "../../../pipes/OrderBy";
import {SIMPLEGRID_DIRECTIVES, ISimpleGridEdit} from "../../simplegrid/SimpleGrid";
import {AppStore} from "angular2-redux-util/dist/index";
import {BusinessAction} from "../../../business/BusinessAction";
import {UserInfo} from "./UserInfo";
import {BusinessUser} from "../../../business/BusinessUser";
import {SimpleGridTable} from "../../simplegrid/SimpleGridTable";
import {ISimpleListItem} from "../../simplelist/Simplelist";
import {MODAL_DIRECTIVES, ModalResult} from 'ng2-bs3-modal/ng2-bs3-modal';
import {AddUser} from "./AddUser";
import {SimpleGridRecord} from "../../simplegrid/SimpleGridRecord";
let _ = require('underscore');


// https://github.com/dougludlow/ng2-bs3-modal

@Component({
    selector: 'UsersDetails',
    changeDetection: ChangeDetectionStrategy.OnPush,
    directives: [SIMPLEGRID_DIRECTIVES, UserInfo, AddUser, MODAL_DIRECTIVES],
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
        <a class="btns" href="#" (click)="$event.preventDefault(); !simpleGridTable || simpleGridTable.getSelected() == null ? '' : launch.open('lg')" [ngClass]="{disabled: !simpleGridTable || simpleGridTable.getSelected() == null}" href="#"><span class="fa fa-plus"></span></a>
        <a class="btns" href="#" (click)="$event.preventDefault(); !simpleGridTable || simpleGridTable.getSelected() == null ? '' : launch.open()" [ngClass]="{disabled: !simpleGridTable || simpleGridTable.getSelected() == null}" href="#"><span class="fa fa-rocket"></span></a>
        <a class="btns" [ngClass]="{disabled: !simpleGridTable || simpleGridTable.getSelected() == null}" href="#"><span class="fa fa-remove"></span></a>
        <a class="btns" [ngClass]="{disabled: !simpleGridTable || simpleGridTable.getSelected() == null}" href="#"><span class="fa fa-key"></span></a>
    </div>
    
     <modal #launch [animation]="animationsEnabled" (onClose)="onClose($event)">
        <modal-header [show-close]="true">
            <h4 class="modal-title">
              <span class="fa fa-user"></span>
              Add new user
            </h4>
        </modal-header>
        <modal-body>
            <addUser [businessId]="getSelectedBusinessId()"></addUser>
        </modal-body>
        <modal-footer [show-default-buttons]="false"></modal-footer>
    </modal>
                
    <br/>
    <div  *ngIf="!_businesses || _businesses.size == 0">
        <h1 class="embossed">USER DETAILS</h1>
        <h6 class="embossedSmaller embossed">select user(s) from the list to load up the related properties</h6>
    </div>
    <div *ngIf="showUserInfo">
        <UserInfo [user]="showUserInfo"></UserInfo>
    </div>
    <div *ngIf="_businesses && _businesses.size > 0 && !showUserInfo">
         <simpleGridTable #userSimpleGridTable>
                <thead>
                <tr>
                  <th sortableHeader="name" [sort]="sort">name</th>
                  <th sortableHeader="businessId" [sort]="sort">business</th>
                  <th>privileges</th>
                  <th>access keys</th>
                  <th>privileges</th>
                </tr>
              </thead>
              <tbody>                                                                          
              <tr class="simpleGridRecord" [table]="userSimpleGridTable" simpleGridRecord *ngFor="#item of _businesses | OrderBy:sort.field:sort.desc; #index=index" [item]="item" [index]="index">
                    <td style="width: 10%" simpleGridData (labelEdited)="onLabelEdited($event,'name')" editable="true" field="name" [item]="item"></td>
                    <td style="width: 10%" simpleGridData field="businessId" [item]="item"></td>
                    <td style="width: 10%" simpleGridData field="privilegeId" [item]="item"></td>
                    <td style="width: 30%" simpleGridDataChecks field="accessMask" (changed)="setAccessMask($event)" [item]="item" [checkboxes]="getAccessMask(item)"></td>
                    <td style="width: 40%" simpleGridDataDropdown></td>
                    <!--<td simpleGridData (labelEdited)="onLabelEdited($event,'maxMonitors')" editable="true" field="maxMonitors" [item]="item"></td>-->
                    <!-- <td simpleGridDataImage color="dodgerblue" [field]="item.getKey('studioLite') == '0' ? 'fa-circle' : 'fa-circle-o'" [item]="item"></td> -->
              </tr>
              </tbody>                 
        </simpleGridTable>
    </div>
    `
})

export class UsersDetails {

    constructor(private appStore:AppStore, private businessActions:BusinessAction) {
    }

    @ViewChild(SimpleGridTable)
    simpleGridTable:SimpleGridTable

    // @ViewChild('launch')
    // launch:ModalComponent

    @Input()
    showUserInfo:ISimpleListItem = null;

    @Input()
    set businesses(i_businesses) {
        this._businesses = i_businesses;
        if (i_businesses && this.simpleGridTable && this._businesses.size != this.totalBusinessSelected) {
            this.simpleGridTable.deselect();
            this.totalBusinessSelected = this._businesses.size;
        }
    }

    public sort:{field:string, desc:boolean} = {field: null, desc: false};

    private _businesses:List<BusinessModel>;
    private totalBusinessSelected:number = 0;
    private someData:number = 1;
    private animationsEnabled:boolean = true;

    private onClose(result:ModalResult) {
    }

    private onLabelEdited(event:ISimpleGridEdit, field) {
        var newValue = event.value;
        var businessUser:BusinessUser = event.item as BusinessUser;
        var oldValue = businessUser.getKey('name');
        var businessId = businessUser.getBusinessId();
        this.appStore.dispatch(this.businessActions.setBusinessUserName(businessId, field, {newValue, oldValue}));
    }

    private getSelectedBusinessId():SimpleGridRecord {
        if (!this.simpleGridTable)
            return null;
        return this.simpleGridTable.getSelected();
    }

    private setAccessMask(event) {
        var businessUser:BusinessUser = event.item as BusinessUser;
        var businessId = businessUser.getBusinessId();
        var name = businessUser.getName();
        var privilegeId = businessUser.privilegeId();
        var accessMask = event.value;
        var bits = [1, 2, 4, 8, 16, 32, 64, 128];
        var computedAccessMask = 0;
        accessMask.forEach(value=> {
            var bit = bits.shift();
            if (value)
                computedAccessMask = computedAccessMask + bit;

        })
        this.appStore.dispatch(this.businessActions.saveBusinessUserAccess(businessId, name, computedAccessMask, privilegeId));
    }

    private getAccessMask(businessUser:BusinessUser) {
        var accessMask = businessUser.getAccessMask();
        var checks = List();
        var bits = [1, 2, 4, 8, 16, 32, 64, 128];
        bits.forEach((bit, idx) => {
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