import {Component, ViewChild, QueryList} from 'angular2/core'
import {CanActivate, ComponentInstruction} from "angular2/router";
import {SimpleList, ISimpleListItem} from "../../simplelist/SimpleList";
import {AppStore} from "angular2-redux-util/dist/index";
import {BusinessModel} from "../../../business/BusinessModel";
import {UsersDetails} from "./UsersDetails";
import {AuthService} from "../../../services/AuthService";
import {appInjService} from "../../../services/AppInjService";
import {BusinessUser} from "../../../business/BusinessUser";
import {Loading} from "../../loading/Loading";
import {List} from 'immutable';
import {PrivelegesModel} from "../../../reseller/PrivelegesModel";
import {DROPDOWN_DIRECTIVES} from "ng2-bootstrap/ng2-bootstrap";
import {BusinessAction} from "../../../business/BusinessAction";

@Component({
    selector: 'Users',
    directives: [SimpleList, UsersDetails, Loading, DROPDOWN_DIRECTIVES],
    styles: [`
      .userView {
        /*background-color: red; */
      }      
      .btns {
          padding: 0 20px 20px 0px;
          font-size: 1.4em;
          color: #313131;
      }
      .btns:hover {
        color: red;
      }
      .enabled {
        opacity: 1
      }
       .disabled {
        opacity: 0.2;
        cursor: default;
      }
      
      .dropdown {
         padding-top: 10px;
         position: relative;
         left: -14px;
      }
      .users {
        margin-top: 10px;
        padding-top: 10px
        font-size: 14px;
      }
      
      .remove {
        font-size: 23px;
        position: relative; 
        left: -20px;
      }

    `],
    template: `
        <div class="row">
             <div class="col-xs-3">
                <div class="users">
                    <div (click)="$event.preventDefault()">
                      <span dropdown (on-toggle)="toggled($event)">
                      <a class="btns addUser" dropdownToggle href="#"><span class="fa fa-plus"></span></a>
                        <ul class="dropdown-menu" aria-labelledby="simple-dropdown">
                          <li *ngFor="#choice of ['Add account from sample','Add a clean account','Add an existing account']">
                            <a (click)="onAddUser(choice)" class="dropdown-item" href="#">{{choice}}</a>
                          </li>
                        </ul>
                      </span>
                      <a (click)="onRemoveUser($event)" [ngClass]="{disabled: !businessesListFiltered || businessesListFiltered && businessesListFiltered.size != 1}" href="#"><span class="remove fa fa-remove"></span></a>
                      </div>
                </div>
                <SimpleList *ngIf="businessesUsers && priveleges" #simpleList [list]="businessesList" 
                    (selected)="onFilteredSelection()"
                    (iconClicked)="onShowUserInfo($event)"
                    [contentId]="getBusinessesId()"
                    [multi]="false"
                    [icon]="'fa-user'"
                    [content]="getBusinesses()">
                </SimpleList>
                <Loading *ngIf="!businessesUsers || !priveleges" [src]="'assets/preload6.gif'" [style]="{'margin-top': '150px'}"></Loading>
             </div>
             <div class="col-xs-9 userView">                
               <UsersDetails *ngIf="businessesUsers && priveleges" [showUserInfo]="showUserInfo" [priveleges]="priveleges" [businesses]="businessUsersListFiltered"></UsersDetails>
               <Loading *ngIf="!businessesUsers || !priveleges" [src]="'assets/preload6.gif'" [style]="{'margin-top': '150px'}"></Loading>
             </div>
        </div>
    `
})

@CanActivate((to:ComponentInstruction, from:ComponentInstruction) => {
    let authService:AuthService = appInjService().get(AuthService);
    return authService.checkAccess(to, from, ['/Login/Login']);
})
export class Users {

    constructor(private appStore:AppStore, private businessAction:BusinessAction) {
        var i_businesses = this.appStore.getState().business;
        var i_reseller = this.appStore.getState().reseller;

        this.businessesList = i_businesses.getIn(['businesses']);
        this.unsub = this.appStore.sub((i_businesses:List<BusinessModel>) => {
            this.businessesList = i_businesses;
        }, 'business.businesses');

        this.businessesUsers = i_businesses.getIn(['businessUsers']);
        this.unsub2 = this.appStore.sub((businessUsers:List<BusinessUser>) => {
            this.businessesUsers = businessUsers;
            this.onFilteredSelection();
        }, 'business.businessUsers');

        this.priveleges = i_reseller.getIn(['privileges']);
        this.unsub3 = this.appStore.sub((privelegesModel:List<PrivelegesModel>) => {
            this.priveleges = privelegesModel;
        }, 'reseller.privileges');
    }

    @ViewChild(SimpleList)
    simpleList:SimpleList;

    private businessesList:List<BusinessModel> = List<BusinessModel>();
    private businessesListFiltered:List<BusinessModel>
    private businessUsersListFiltered:List<BusinessUser>;
    private businessesUsers:List<BusinessUser>
    private priveleges:List<PrivelegesModel>
    private showUserInfo:Object = null;
    private unsub:Function;
    private unsub2:Function;
    private unsub3:Function;

    private onAddUser(choice) {
        switch (choice) {
            case 'Add account from sample':
            {
                break;
            }
            case 'Add a clean account':
            {
                break;
            }
            case 'Add an existing account':
            {
                break;
            }
        }
    }

    private onRemoveUser() {
        if (!this.businessesListFiltered || this.businessesListFiltered.size != 1)
            return
        var businessModel:BusinessModel = this.businessesListFiltered.first();
        this.appStore.dispatch(this.businessAction.removeBusiness(businessModel.getBusinessId()));
        this.businessesListFiltered = null;
    }

    private onShowUserInfo(selectedBusiness:ISimpleListItem) {
        this.showUserInfo = selectedBusiness;
    }

    private onFilteredSelection() {
        this.showUserInfo = null;
        if (!this.simpleList)
            return;
        var businessSelected = this.simpleList.getSelected();

        this.businessesListFiltered = this.businessesList.filter((businessModel:BusinessModel)=> {
            var businessId = businessModel.getBusinessId();
            return businessSelected[businessId] && businessSelected[businessId].selected;
        }) as List<any>;

        let arr = [];
        this.businessesListFiltered.forEach((businessModel:BusinessModel)=> {
            let businessModelId = businessModel.getBusinessId();
            this.businessesUsers.forEach((businessUser:BusinessUser) => {
                var businessUserId = businessUser.getBusinessId();
                if (businessUserId == businessModelId) {
                    arr.push(businessUser);
                }
            })
        })
        this.businessUsersListFiltered = List<BusinessUser>(arr);
        console.log();
    }

    private getBusinesses() {
        return (businessItem:BusinessModel)=> {
            return businessItem.getKey('name');
        }
    }

    private getBusinessesId() {
        return (businessItem:BusinessModel)=> {
            return businessItem.getKey('businessId');
        }
    }

    private ngOnDestroy() {
        this.unsub();
        this.unsub2();
        this.unsub3();
    }
}

