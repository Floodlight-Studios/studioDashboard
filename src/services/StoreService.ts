import {Injectable, provide} from "angular2/core";
import {BusinessAction} from "../business/BusinessAction";
import {ResellerAction} from "../reseller/ResellerAction";
import {AppdbAction} from "../appdb/AppdbAction";
import {AppStore} from "angular2-redux-util/dist/index";
import {StationsAction} from "../stations/StationsAction";
import {List, Map} from 'immutable';
import {CommBroker} from "./CommBroker";
import {Consts} from "../Conts";
import {StationModel} from "../stations/StationModel";
const _ = require('underscore');

@Injectable()
export class StoreService {
    constructor(private appStore:AppStore,
                private businessActions:BusinessAction,
                private resellerAction:ResellerAction,
                private stationsAction:StationsAction,
                private appDbActions:AppdbAction,
                private commBroker:CommBroker) {

        this.appStore.dispatch(this.appDbActions.initAppDb());
    }

    private singleton:boolean = false; // prevent multiple calls to this service
    // todo: in private / hybrid mode we need to get list of business servers
    // private knownServers:Array<string> = ['mars.signage.me', 'mercury.signage.me'];
    private knownServers:Array<string> = [];
    private running:boolean = false;

    public loadServices() {
        if (this.singleton)
            return;
        this.singleton = true;
        this.listenServices();
        this.appStore.dispatch(this.resellerAction.getResellerInfo());
        this.appStore.dispatch(this.resellerAction.getAccountInfo());
        this.appStore.dispatch(this.businessActions.fetchBusinesses());
    }

    private initPollServices() {
        if (this.running)
            return;
        this.running = true;
        setInterval(()=> {
            this.appStore.dispatch(this.appDbActions.serverStatus());
            // this.fetchStations()
        }, 10000);
    }

    private listenServices() {
        /** if we are in cloud mode, first fetch active servers before getting station
         (1) get businesses
         **/
        this.appStore.sub(() => {
            // use 0 instead of ServerMode.CLOUD due to production bug with Enums
            if (this.commBroker.getValue(Consts.Values().SERVER_MODE) == 0) {
                this.appStore.dispatch(this.appDbActions.getCloudServers());
            } else {
                this.fetchStations();
            }
        }, 'business.businessStats');

        /** (2 optional) if we are running in cloud, get list of used servers **/
        this.appStore.sub((servers:List<string>) => {
            this.knownServers = servers.toArray();
            this.fetchStations();
        }, 'appdb.cloudServers');

        /** (3) receive each set of stations status per server **/
        this.appStore.sub((stations:Map<string, List<StationModel>>) => {
            // console.log('received station');
        }, 'stations');

        /** (4) once we have all stations, we can get their respective servers and geo info **/
        this.appStore.sub((totalStationsReceived:number) => {
            this.appStore.dispatch(this.appDbActions.serverStatus());
            this.appStore.dispatch(this.stationsAction.getStationsIps())

            setTimeout(()=>this.appStore.dispatch(this.stationsAction.getStationsIps()), 5000)
        }, 'appdb.totalStations');

        /** (5) received station status **/
        this.appStore.sub((serversStatus:Map<string,any>) => {
            // todo: enable in production and set poll value in settings
            //this.initPollServices();
        }, 'appdb.serversStatus', false);
    }

    private fetchStations() {
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


// this.appStore.dispatch(this.appDbActions.serverStatus());
