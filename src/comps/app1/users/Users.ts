import {Component} from 'angular2/core'
import {SimpleList} from "../../simplelist/SimpleList";
import {AppStore} from "angular2-redux-util/dist/index";
import {BusinessAction} from "../business/BusinessAction";
import {BusinessModel} from "../business/BusinesModel";

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
    private items
    private ubsub;

    constructor(private appStore:AppStore, private businessActions:BusinessAction) {
        this.appStore.dispatch(businessActions.fetchBusinesses());
        //self.appStore.dispatch(businessActions.setBusinessField('322949', 'businessDescription', Math.random()));
        //this.loadCustomers = businessActions.createDispatcher(businessActions.fetchBusinesses, appStore);

        this.ubsub = appStore.sub((businesses:Map<string,any>) => {
            this.items = businesses;
        }, 'business', false);

    }

    _onUserSelected(user:BusinessModel){
        console.log(`${user.getKey('name')}`);
        console.log(`${user.getKey('businessId')}`);
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

