import {Component} from 'angular2/core'
import {SimpleList} from "../../simplelist/SimpleList";
import {AppStore} from "angular2-redux-util/dist/index";
import {BusinessAction} from "../business/BusinessAction";
import {BusinessModel} from "../business/BusinesModel";
import List = Immutable.List;

@Component({
    selector: 'Users',
    directives: [SimpleList],
    providers: [BusinessAction],
    styles: [`
      .userView {
        background-color: lightgray;
      }
    `],
    template: `
        <div class="row">
             <h1>Users</h1>
             <div class="col-lg-3">
                <SimpleList [list]="items" (current)="_onUserSelected($event)"
                [contentId]="_getBusinessesId()" [content]="_getBusinesses()"></SimpleList>
             </div>
             <div class="col-lg-9 userView" appHeight>
                <h1>users view</h1>
                <h1>users view</h1>
                <h1>users view</h1>
                <h1>users view</h1>
                <h1>users view</h1>
             </div>
        </div>

    `
})
export class Users {
    private items;
    private ubsub;

    constructor(private appStore:AppStore, private businessActions:BusinessAction) {
        this.appStore.dispatch(businessActions.fetchBusinesses());

        setInterval(()=>this.appStore.dispatch(businessActions.fetchBusinesses()), 10000)
        //self.appStore.dispatch(businessActions.setBusinessField('322949', 'businessDescription', Math.random()));
        //this.loadCustomers = businessActions.createDispatcher(businessActions.fetchBusinesses, appStore);

        this.ubsub = appStore.sub((businesses:Map<string,any>) => {
            this.items = businesses;
        }, 'business', false);

    }

    _onUserSelected(event) {
        var state:List<BusinessModel> = this.appStore.getState().business;

        function indexOf(i_businessId:string) {
            var businessId:number = Number(i_businessId);
            return state.findIndex((i:BusinessModel) => i.getKey('businessId') === businessId);
        }
        var state:List<BusinessModel> = this.appStore.getState().business;
        var businessModel:BusinessModel = state.get(indexOf(event.id));
        console.log(`${businessModel.getKey('name')} ${event.id} selected=${event.selected}`)
    }

    _getBusinesses() {
        return (businessItem:BusinessModel)=> {
            return businessItem.getKey('name');
        }
    }

    _getBusinessesId() {
        return (businessItem:BusinessModel)=> {
            return businessItem.getKey('businessId');
        }
    }

    ngOnDestroy() {
        this.ubsub();
    }

}

