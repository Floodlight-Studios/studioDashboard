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
import {Lib} from "../../../Lib";
import {PrivelegesModel} from "../../../reseller/PrivelegesModel";
let _ = require('underscore');
const bootbox = require('bootbox');

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
             hr { 
                border-top: 3px double #d7d7d7;
            }
    `],

    template: `    
    <div style="position: relative; top: 10px">
        <a class="btns" href="#" (click)="$event.preventDefault(); !simpleGridTable || simpleGridTable.getSelected() == null ? '' : launch.open('lg')" [ngClass]="{disabled: !simpleGridTable || simpleGridTable.getSelected() == null}" href="#"><span class="fa fa-plus"></span></a>
        <a class="btns" href="#" (click)="$event.preventDefault(); !simpleGridTable || simpleGridTable.getSelected() == null ? '' : launch.open()" [ngClass]="{disabled: !simpleGridTable || simpleGridTable.getSelected() == null}" href="#"><span class="fa fa-rocket"></span></a>
        <a class="btns" href="#" (click)="$event.preventDefault(); !simpleGridTable || simpleGridTable.getSelected() == null ? '' : removeBusinessUser()" [ngClass]="{disabled: !simpleGridTable || simpleGridTable.getSelected() == null}" href="#"><span class="fa fa-remove"></span></a>
        <a class="btns" [ngClass]="{disabled: !simpleGridTable || simpleGridTable.getSelected() == null}" href="#"><span class="fa fa-key"></span></a>
    </div>
    <hr/>
     <modal #launch [animation]="animationsEnabled" (onClose)="onClose($event)">
        <modal-header [show-close]="true">
            <h4 class="modal-title">
              <span class="fa fa-user"></span>
              Add new user
            </h4>
        </modal-header>
        <modal-body>
            <addUser [businessModel]="selectedBusinessUser()" [priveleges]="m_priveleges"></addUser>
        </modal-body>
        <modal-footer [show-default-buttons]="false"></modal-footer>
    </modal>
                
    <br/>
    <!--<div *ngIf="showUserInfo == 'null' || !m_businesses || m_businesses.size == 0">-->
        <!--<h1 class="embossed">USER DETAILS</h1>-->
        <!--<h6 class="embossedSmaller embossed">select user(s) from the list to load up the related properties</h6>-->
    <!--</div>-->
    <div *ngIf="showUserInfo">
        <UserInfo [user]="showUserInfo"></UserInfo>
    </div>
    <div *ngIf="m_businesses && m_businesses.size > 0 && !showUserInfo">
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
              <tr class="simpleGridRecord" [table]="userSimpleGridTable" simpleGridRecord *ngFor="#item of m_businesses | OrderBy:sort.field:sort.desc; #index=index" [item]="item" [index]="index">
                    <td style="width: 10%" simpleGridData (labelEdited)="onLabelEdited($event,'name')" editable="true" field="name" [item]="item"></td>
                    <td style="width: 10%" simpleGridData field="businessId" [item]="item"></td>
                    <td style="width: 10%" simpleGridData field="privilegeId" [item]="item"></td>
                    <td style="width: 30%" simpleGridDataChecks (changed)="setAccessMask($event)" [item]="item" [checkboxes]="getAccessMask(item)"></td>
                    <td style="width: 40%" simpleGridDataDropdown [testSelection]="selectedPriveleges()" (changed)="setPriveleges($event)" field="name" [item]="item" [dropdown]="m_priveleges"></td>
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
        this.m_businesses = i_businesses;
        if (i_businesses && this.simpleGridTable && this.m_businesses.size != this.totalBusinessSelected) {
            this.simpleGridTable.deselect();
            this.totalBusinessSelected = this.m_businesses.size;
        }
    }

    @Input()
    set priveleges(i_priveleges) {
        this.m_priveleges = i_priveleges;
    }

    public sort:{field:string, desc:boolean} = {field: null, desc: false};
    private m_businesses:List<BusinessModel>;
    private m_priveleges:Array<PrivelegesModel>;
    private totalBusinessSelected:number = 0;
    private animationsEnabled:boolean = true;

    private onClose(result:ModalResult) {
    }

    private removeBusinessUser() {
        var businessUser:BusinessUser = this.selectedBusinessUser();
        bootbox.confirm(`Are you sure you want to remove the user ${businessUser.getName()}?`, (result) => {
            if (result) {
                this.appStore.dispatch(this.businessActions.removeBusinessUser(businessUser));
            }
        });
    }

    private onLabelEdited(event:ISimpleGridEdit, field) {
        var newValue = event.value;
        var businessUser:BusinessUser = event.item as BusinessUser;
        var oldValue = businessUser.getKey('name');
        var businessId = businessUser.getBusinessId();
        this.appStore.dispatch(this.businessActions.setBusinessUserName(businessId, field, {newValue, oldValue}));
    }

    private selectedBusinessUser():BusinessUser {
        if (!this.simpleGridTable)
            return null;
        let selected:SimpleGridRecord = this.simpleGridTable.getSelected();
        return selected ? this.simpleGridTable.getSelected().item : '';
    }

    private setPriveleges(event) {
        let privilegeId = -1;
        let privelegesName:string = event.value;
        var businessUser:BusinessUser = event.item as BusinessUser;
        var businessId = businessUser.getBusinessId();
        var name = businessUser.getName();
        var accessMask = businessUser.getAccessMask();
        var privileges:Array<PrivelegesModel> = this.appStore.getState().reseller.getIn(['privileges']);
        privileges.forEach((privelegesModel:PrivelegesModel)=> {
            if (privelegesModel.getName() == privelegesName) {
                privilegeId = privelegesModel.getPrivelegesId();
            }
        })
        this.appStore.dispatch(this.businessActions.updateBusinessUserAccess(businessId, name, accessMask, privilegeId));
    }

    private selectedPriveleges() {
        return (privelegesModel:PrivelegesModel, businessUser:BusinessUser) => {
            return businessUser.privilegeId() == privelegesModel.getPrivelegesId() ? 'selected' : '';
        }
    }

    private setAccessMask(event) {
        var businessUser:BusinessUser = event.item as BusinessUser;
        var businessId = businessUser.getBusinessId();
        var name = businessUser.getName();
        var privilegeId = businessUser.privilegeId();
        var accessMask = event.value;
        var computedAccessMask = Lib.ComputeAccessMask(accessMask);
        this.appStore.dispatch(this.businessActions.updateBusinessUserAccess(businessId, name, computedAccessMask, privilegeId));
    }

    private getAccessMask(businessUser:BusinessUser) {
        var accessMask = businessUser.getAccessMask();
        return Lib.GetAccessMask(accessMask);
    }
}