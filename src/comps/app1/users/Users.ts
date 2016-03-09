import {Component, ViewChild, QueryList} from 'angular2/core'
import {CanActivate, ComponentInstruction} from "angular2/router";
import {SimpleList} from "../../simplelist/SimpleList";
import {AppStore} from "angular2-redux-util/dist/index";
import {BusinessModel} from "../../../business/BusinessModel";
import {UsersDetails} from "./UsersDetails";
import {AuthService} from "../../../services/AuthService";
import {appInjService} from "../../../services/AppInjService";
import {BusinessUser} from "../../../business/BusinessUser";
import {Loading} from "../../loading/Loading";
import {List} from 'immutable';

@Component({
    selector: 'Users',
    directives: [SimpleList, UsersDetails, Loading],
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

    `],
    template: `
        <div class="row">
             <div class="col-xs-3">
                <div style="position: relative; top: 10px">
                    <a class="btns" href="#"><span class="fa fa-plus"></span></a>
                    <a class="btns" [ngClass]="{disabled: !businessesListFiltered || businessesListFiltered && businessesListFiltered.size != 1}" href="#"><span class="fa fa-remove"></span></a>
                </div>
                <SimpleList *ngIf="businessesUsers" #simpleList [list]="businessesList" 
                    (selected)="onFilteredSelection()"
                    [contentId]="getBusinessesId()"
                    [setIcon]="'fa-edit'"
                    [content]="getBusinesses()">
                </SimpleList>
                <Loading *ngIf="!businessesUsers" [src]="'assets/preload6.gif'" [style]="{'margin-top': '150px'}"></Loading>
             </div>
             <div class="col-xs-9 userView">                
               <UsersDetails *ngIf="businessesUsers" [businesses]="businessUsersListFiltered"></UsersDetails>
               <Loading *ngIf="!businessesUsers" [src]="'assets/preload6.gif'" [style]="{'margin-top': '150px'}"></Loading>
             </div>
        </div>
    `
})
@CanActivate((to:ComponentInstruction, from:ComponentInstruction) => {
    let authService:AuthService = appInjService().get(AuthService);
    return authService.checkAccess(to, from, ['/Login/Login']);
})
export class Users {

    @ViewChild(SimpleList)
    simpleList:SimpleList;

    private businessesList:List<BusinessModel> = List<BusinessModel>();
    private businessesListFiltered:List<BusinessModel>
    private businessUsersListFiltered:List<BusinessUser>;
    private businessesUsers:List<BusinessUser>
    private unsub:Function;
    private unsub2:Function;

    constructor(private appStore:AppStore) {
        var i_businesses = this.appStore.getState().business;

        this.businessesList = i_businesses.getIn(['businesses']);
        this.unsub = this.appStore.sub((i_businesses:List<BusinessModel>) => {
            this.businessesList = i_businesses;
        }, 'business.businesses');

        this.businessesUsers = i_businesses.getIn(['businessUsers']);
        this.unsub2 = this.appStore.sub((businessUsers:List<BusinessUser>) => {
            this.businessesUsers = businessUsers;
            this.onFilteredSelection();
        }, 'business.businessUsers');
    }

    private onFilteredSelection() {
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
    }
}

