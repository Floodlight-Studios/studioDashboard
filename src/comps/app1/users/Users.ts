import {Component, ViewChild, QueryList} from 'angular2/core'
import {SimpleList} from "../../simplelist/SimpleList";
import {AppStore} from "angular2-redux-util/dist/index";
import {BusinessAction} from "../../../business/BusinessAction";
import {BusinessModel} from "../../../business/BusinesModel";
import {List, Map} from 'immutable';
import {CommBroker} from "../../../services/CommBroker";
import {Consts} from "../../../Conts";
import {UsersDetails} from "./UsersDetails";


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
    providers: [BusinessAction],
    styles: [`
      .userView {
        /*background-color: red; */
      }      
    `],
    template: `
        <div class="row">
             <div class="col-xs-3">
                <SimpleList #simpleList [list]="businessesList" 
                    (selected)="updateFilteredSelection()"
                    [contentId]="getBusinessesId()"
                    [content]="getBusinesses()">
                </SimpleList>
             </div>
             <div class="col-xs-9 userView fill_scroll">
               <UsersDetails [businesses]="businessesFilteredList"></UsersDetails>
             </div>
        </div>
    `
})
export class Users {

    @ViewChild(SimpleList)
    simpleList:SimpleList;


    private businessesList:List<BusinessModel> = List<BusinessModel>();
    private businessesFilteredList:List<BusinessModel>
    private unsub:Function;

    constructor(private appStore:AppStore, private commBroker:CommBroker, private businessActions:BusinessAction) {
        this.loadData();
    }

    private loadData() {
        if (this.appStore.getState().business.size == 0) {
            this.appStore.dispatch(this.businessActions.fetchBusinesses());
        } else {
            var i_businesses = this.appStore.getState().business;
            this.businessesList = i_businesses.getIn(['businesses']);
        }
        this.unsub = this.appStore.sub((i_businesses:List<BusinessModel>) => {
            this.businessesList = i_businesses;
        }, 'business.businesses');
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
    }
}
