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
const _ = require('underscore');

@Component({
    directives: [Infobox, ServerStats, ServerAvg, StationsMap],
    selector: 'Dashboard',
    styles: [`      
      * {
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
        this.loadData();
    }

    private stations;
    private unsubs:Array<()=>void> = [];
    private businessStats = {};
    private serverStats;
    private serverAvgResponse;
    private serverStatsCategories;

    routerOnActivate(to:ComponentInstruction, from:ComponentInstruction) {
    }

    private loadData() {
        var self = this, unsub;

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
        this.stations = this.appStore.getState().stations;
        if (_.size(this.stations) > 0)
            this.filterStations();
        unsub = this.appStore.sub((stations:Map<string, List<StationModel>>) => {
            this.stations = stations;
            this.filterStations();
        }, 'stations');
        this.unsubs.push(unsub);

        /** servers response stats **/
        unsub = this.appStore.sub((serversStatus:Map<string,any>) => {
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
        }, 'appdb.serversStatus', false);
        this.unsubs.push(unsub);
    }

    private fetchStations() {
        var sources:Map<string,any> = this.appStore.getState().business.getIn(['businessSources']).getData();
        sources.forEach((i_businesses:List<string>, source)=> {
            let businesses = i_businesses.toArray();
            this.appStore.dispatch(this.stationsAction.getStationsInfo(source, businesses));
        })
    }

    private filterStations() {
        console.log(this.stations);
    }

    private ngOnDestroy() {
        this.unsubs.forEach((unsub:()=>void)=> {
            unsub();
        })
    }
}

