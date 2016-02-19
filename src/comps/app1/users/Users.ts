import {Component} from 'angular2/core'
import {SimpleList} from "../../simplelist/SimpleList";
import {AppStore} from "angular2-redux-util/dist/index";
import {BusinessAction} from "../../../business/BusinessAction";
import {BusinessModel} from "../../../business/BusinesModel";
import {List} from 'immutable';
import {CommBroker} from "../../../services/CommBroker";
import {Consts} from "../../../Conts";
import {UsersDetails} from "./UsersDetails";

@Component({
    selector: 'Users',
    directives: [SimpleList, UsersDetails],
    providers: [BusinessAction],
    styles: [`
      .userView {
        /*background-color: red;        */
      }      
    `],
    template: `
        <div class="row">
             <div class="col-lg-3">
                <SimpleList #simpleList [list]="businessesList" (selected)="onBusinessesFiltered($event)"
                [contentId]="getBusinessesId()" [content]="getBusinesses()"></SimpleList>
             </div>
             <div class="col-lg-9 userView" appHeight>
               <UsersDetails [businesses]="businessesFilteredList"></UsersDetails>
             </div>
        </div>
    `
})
export class Users {
    private businessesList:List<BusinessModel> = List<BusinessModel>();
    private businessesFilteredList:List<BusinessModel>
    private businessSelected = {}

    private ubsub:Function;

    constructor(private appStore:AppStore, private commBroker:CommBroker, private businessActions:BusinessAction) {
        this.listenBusinessesStore();
        this.appStore.dispatch(businessActions.fetchBusinesses());
    }

    private listenBusinessesStore() {
        this.ubsub = this.appStore.sub((i_businesses:List<BusinessModel>) => {
            this.businessesList = i_businesses;
            this.updateFilteredSelection()
        }, 'business', false);
    }

    private onBusinessesFiltered(i_businessSelected) {
        this.businessSelected = i_businessSelected;
        this.updateFilteredSelection();
    }

    private updateFilteredSelection(){
        var self = this;
        this.businessesFilteredList = this.businessesList.filter((businessModel:BusinessModel)=> {
            var businessId = businessModel.getKey('businessId');
            return self.businessSelected[businessId] && self.businessSelected[businessId].selected;
        }) as List<any,BusinessModel>;
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

    private ngOnInit() {
        this.commBroker.getService(Consts.Services().App).appResized();
    }

    private ngOnDestroy() {
        this.ubsub();
    }

}





























// var state:List<BusinessModel> = this.appStore.getState().business;
// function indexOf(i_businessId:string) {
//     var businessId:number = Number(i_businessId);
//     return state.findIndex((i:BusinessModel) => i.getKey('businessId') === businessId);
// }
// var state:List<BusinessModel> = this.appStore.getState().business;
// var businessModel:BusinessModel = state.get(indexOf(businessId));
//console.log(`${businessModel.getKey('name')} ${businessId} ${event.selected}`);

// setInterval(()=>this.appStore.dispatch(businessActions.fetchBusinesses()), 100000);
//self.appStore.dispatch(businessActions.setBusinessField('322949', 'businessDescription', Math.random()));
//this.loadCustomers = businessActions.createDispatcher(businessActions.fetchBusinesses, appStore);


// console.log(event);
// return;
// var business:BusinessModel = event.item;
// var id = business.getKey('businessId');
// if (event.selected) {
//     this._metadata[id] = true;
// } else {
//     delete this._metadata[id];
// }

// if (this.businessActions.findBusinessIndex(business, this.businessesSelected) == -1)
//     this.businessesSelected = this.businessesSelected.push(business);
// } else {
//     let index:number = this.businessActions.findBusinessIndex(business, this.businessesSelected);
//     this.businessesSelected = this.businessesSelected.delete(index);
// }

// private _metadata:Object = {};
