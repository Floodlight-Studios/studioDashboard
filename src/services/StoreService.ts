import {Injectable, provide} from "angular2/core";
import {BusinessAction} from "../business/BusinessAction";
import {ResellerAction} from "../reseller/ResellerAction";
import {AppdbAction} from "../appdb/AppdbAction";
import {AppStore} from "angular2-redux-util/dist/index";
import {StationsAction} from "../stations/StationsAction";
import {List, Map} from 'immutable';
import {CommBroker} from "./CommBroker";
import {Consts} from "../Conts";
const _ = require('underscore');

@Injectable()
export class StoreService {
    constructor(private appStore:AppStore,
                private businessActions:BusinessAction,
                private resellerAction:ResellerAction,
                private stationsAction:StationsAction,
                private appDbActions:AppdbAction,
                private commBroker:CommBroker) {
    }

    private singleton:boolean = false; // prevent multiple calls to this service
    // private knownServers:Array<string> = ['mars.signage.me', 'mercury.signage.me'];
    private knownServers:Array<string> = [];

    public loadServices() {
        if (this.singleton)
            return;
        this.singleton = true;
        this.listenServices();
        this.appStore.dispatch(this.businessActions.fetchBusinesses());
        this.appStore.dispatch(this.appDbActions.serverStatus());
        this.appStore.dispatch(this.resellerAction.getResellerInfo());
    }

    private startTimedServices() {
        // todo: enable in production and set poll value in settings
        // setInterval(()=> {
        //     this.fetchStations()
        // }, 3000);
    }

    private listenServices() {

        this.appStore.sub((servers:List<string>) => {
            this.knownServers = servers.toArray();
            this.fetchStations();
        }, 'appdb.cloudServers');

        // if we are in cloud mode, first fetch active servers before getting station
        this.appStore.sub(() => {
            // use 0 instead of ServerMode.CLOUD due to production bug with Enums
            if (this.commBroker.getValue(Consts.Values().SERVER_MODE) == 0) {
                this.appStore.dispatch(this.appDbActions.getCloudServers());
            } else {
                this.fetchStations();
            }
        }, 'business.businessStats');
    }

    public fetchStations() {
        var sources:Map<string,any> = this.appStore.getState().business.getIn(['businessSources']).getData();
        var config = {}
        sources.forEach((i_businesses:List<string>, source)=> {
            let businesses = i_businesses.toArray();
            if (this.knownServers.indexOf(source) > -1)
                config[source] = businesses;

        });
        this.appStore.dispatch(this.stationsAction.getStationsInfo(config));
    }
}
