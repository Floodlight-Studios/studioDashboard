import {Component, Injector} from 'angular2/core'
import {Infobox} from "../../infobox/Infobox";
import {List, Map} from 'immutable';
import {AppStore} from "angular2-redux-util/dist/index";
import {BusinessAction} from "../../../business/BusinessAction";
import {ServerStats} from "./ServerStats";
import {ServerAvg} from "./ServerAvg";
import {AppdbAction} from "../../../appdb/AppdbAction";
import {StationsMap} from "./StationsMap";
import {CanActivate, OnActivate, ComponentInstruction, Router} from "angular2/router";
import {appInjService} from "../../../services/AppInjService";
import {AuthService} from "../../../services/AuthService";
import {StationsAction} from "../../../stations/StationsAction";
import {StationModel} from "../../../stations/StationModel";
import {Loading} from "../../loading/Loading";
import {OrderBy} from "../../../pipes/OrderBy";
const _ = require('underscore');

@Component({
    directives: [Infobox, ServerStats, ServerAvg, StationsMap, Loading],
    selector: 'Dashboard',
    pipes: [OrderBy],
    styles: [`      
      * {
             border-radius: 0 !important;
        }
        input {
             border-radius: 0 !important;
        }
    `],
    providers: [BusinessAction],
    templateUrl: '/src/comps/app1/dashboard/Dashboard.html'
})

@CanActivate((to:ComponentInstruction, from:ComponentInstruction) => {
    let authService:AuthService = appInjService().get(AuthService);
    return authService.checkAccess(to, from);
})
export class Dashboard implements OnActivate {

    constructor(private appStore:AppStore, private appDbActions:AppdbAction, private stationsAction:StationsAction) {
        this.serverStats = [];
        this.serverStatsCategories = [];
        this.serverAvgResponse = 0;
        this.appStore.dispatch(this.appDbActions.serverStatus());
        // setTimeout(()=>{
            this.loadData()
        // },2000);
    }

    private sort:{field:string, desc:boolean} = {field: null, desc: false};
    private stations:Map<string, List<StationModel>>;
    private unsubs:Array<()=>void> = [];
    private businessStats = {};
    private serverStats;
    private serverAvgResponse;
    private serverStatsCategories;
    private serverPendingCalls:number = 0;
    private skipServers:Array<string> = ['mars.signage.me', 'mercury.signage.me'];
    private stationFilters = {
        os: [],
        airVersion: [],
        appVersion: []
    };

    routerOnActivate(to:ComponentInstruction, from:ComponentInstruction) {
    }

    private loadData() {
        var unsub;

        /** business stats **/
        this.businessStats = this.appStore.getState().business.getIn(['businessStats']) || {};
        if (_.size(this.businessStats) > 0)
            this.fetchStations();
        unsub = this.appStore.sub((i_businesses:Map<string,any>) => {
            this.businessStats = i_businesses;
            this.fetchStations();
        }, 'business.businessStats');
        this.unsubs.push(unsub);

        /** stations stats **/
        // this.stations = this.appStore.getState().stations;
        //this.buildStationsFilter();
        unsub = this.appStore.sub((stations:Map<string, List<StationModel>>) => {
            this.stations = stations;
            this.buildStationsFilter();
        }, 'stations');
        this.unsubs.push(unsub);

        /** servers response stats **/
        var serversStatus = this.appStore.getState().appdb.getIn(['serversStatus']);
        this.loadServerStats(serversStatus);
        unsub = this.appStore.sub((serversStatus:Map<string,any>) => {
            this.loadServerStats(serversStatus);
        }, 'appdb.serversStatus', false);
        this.unsubs.push(unsub);
    }

    private loadServerStats(serversStatus:Map<string,any>) {
        if (!serversStatus)
            return;
        var self = this;
        let c = 0;
        let t = 0;
        this.serverStats = [];
        this.serverStatsCategories = [];
        serversStatus.forEach((value, key)=> {
            self.serverStatsCategories.push(key);
            c++;
            t = t + Number(value);
            self.serverStats.push(Number(value));
        })
        this.serverAvgResponse = t / c;
    }

    private fetchStations() {
        var sources:Map<string,any> = this.appStore.getState().business.getIn(['businessSources']).getData();
        sources.forEach((i_businesses:List<string>, source)=> {
            let businesses = i_businesses.toArray();
            if (this.skipServers.indexOf(source) > -1)
                return;
            this.serverPendingCalls++;
            this.appStore.dispatch(this.stationsAction.getStationsInfo(source, businesses));
        })
    }

    private buildStationsFilter() {
        // if (this.stations.size == 0)
        //     return;
        this.serverPendingCalls--;
        if (this.serverPendingCalls == 0) {
            this.stations.forEach((stationList:List<StationModel>, source)=> {
                stationList.forEach((i_station:StationModel)=> {
                    this.stationFilters['os'].push(i_station.getKey('os'));
                    this.stationFilters['appVersion'].push(i_station.getKey('appVersion'));
                    this.stationFilters['airVersion'].push(i_station.getKey('airVersion'));
                })
            });
            this.stationFilters['os'] = _.uniq(this.stationFilters['os']).filter(function (n) {
                return n != ''
            });
            this.stationFilters['appVersion'] = _.uniq(this.stationFilters['appVersion']).filter(function (n) {
                return n != ''
            });
            this.stationFilters['airVersion'] = _.uniq(this.stationFilters['airVersion']).filter(function (n) {
                return n != ''
            });
        }
    }

    private ngOnDestroy() {
        this.unsubs.forEach((unsub:()=>void)=> {
            unsub();
        })
    }
}

