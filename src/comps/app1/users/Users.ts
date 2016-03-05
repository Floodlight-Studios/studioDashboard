import {Component, ViewChild, QueryList} from 'angular2/core'
import {CanActivate, OnActivate, ComponentInstruction, Router} from "angular2/router";
import {SimpleList} from "../../simplelist/SimpleList";
import {AppStore} from "angular2-redux-util/dist/index";
import {BusinessAction} from "../../../business/BusinessAction";
import {BusinessModel} from "../../../business/BusinessModel";
import {List, Map} from 'immutable';
import {CommBroker} from "../../../services/CommBroker";
import {Consts} from "../../../Conts";
import {UsersDetails} from "./UsersDetails";
import {AuthService} from "../../../services/AuthService";
import {appInjService} from "../../../services/AppInjService";
import {BusinessUser} from "../../../business/BusinessUser";


//todo: add access mask
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

@Component({
    selector: 'Users',
    directives: [SimpleList, UsersDetails],
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
                    <a class="btns" [ngClass]="{disabled: !businessesFilteredList || businessesFilteredList && businessesFilteredList.size != 1}" href="#"><span class="fa fa-rocket"></span></a>
                    <a class="btns" [ngClass]="{disabled: !businessesFilteredList || businessesFilteredList && businessesFilteredList.size != 1}" href="#"><span class="fa fa-remove"></span></a>
                    <a class="btns" [ngClass]="{disabled: !businessesFilteredList || businessesFilteredList && businessesFilteredList.size != 1}" href="#"><span class="fa fa-key"></span></a>
                </div>
                <br/>
                <SimpleList #simpleList [list]="businessesList" 
                    (selected)="updateFilteredSelection()"
                    [contentId]="getBusinessesId()"
                    [content]="getBusinesses()">
                </SimpleList>
             </div>
             <div class="col-xs-9 userView">
               <UsersDetails [businesses]="businessesFilteredList"></UsersDetails>
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
    private businessesFilteredList:List<BusinessModel>
    private unsub:Function;
    private unsub2:Function;

    constructor(private appStore:AppStore, private commBroker:CommBroker, private businessActions:BusinessAction) {
        var i_businesses = this.appStore.getState().business;
        this.businessesList = i_businesses.getIn(['businesses']);

        this.unsub = this.appStore.sub((i_businesses:List<BusinessModel>) => {
            this.businessesList = i_businesses;
        }, 'business.businesses');

        this.unsub2 = this.appStore.sub((businessUser:BusinessUser) => {
            // this.nameEmail = businessUser.getKey('emailName');
            // this.updateUi();
        }, 'business.businessUser');
    }

    ngOnInit() {
        this.commBroker.getService(Consts.Services().App).appResized();
    }

    private updateFilteredSelection() {
        var businessSelected = this.simpleList.getSelected();
        this.businessesFilteredList = this.businessesList.filter((businessModel:BusinessModel)=> {
            var businessId = businessModel.getKey('businessId');
            return businessSelected[businessId] && businessSelected[businessId].selected;
        }) as List<any>;

        var businessIds = [];
        this.businessesFilteredList.forEach((businessModel:BusinessModel)=> {
            businessIds.push(businessModel.getKey('businessId'));
        })
        this.appStore.dispatch(this.businessActions.fetchBusinessUser(businessIds))


        // if (this.businessesFilteredList.size != 1)
        //     return;
        // var businessId = this.businessesFilteredList.first().getKey('businessId');
        // this.appStore.dispatch(this.businessActions.fetchBusinessUser(businessId));
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

// if (this.appStore.getState().business.size == 0) {
//     this.appStore.dispatch(this.businessActions.fetchBusinesses());
// } else {
//     var i_businesses = this.appStore.getState().business;
//     this.businessesList = i_businesses.getIn(['businesses']);
// }