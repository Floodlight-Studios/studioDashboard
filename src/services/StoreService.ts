import {Injectable, provide} from "angular2/core";
import {BusinessAction} from "../business/BusinessAction";
import {AppdbAction} from "../appdb/AppdbAction";
import {AppStore} from "angular2-redux-util/dist/index";

@Injectable()
export class StoreService {
    constructor(private appStore:AppStore,
                private businessActions:BusinessAction,
                private appDbActions:AppdbAction) {
        this.loadServices();
    }

    private loadServices(){
        this.appStore.dispatch(this.businessActions.fetchBusinesses());
        this.appStore.dispatch(this.appDbActions.serverStatus());
    }
}