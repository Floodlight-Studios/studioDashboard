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
import {SortBy} from "../../../pipes/SortBy";
import {StationsGrid} from "./StationsGrid";
const _ = require('underscore');

@Component({
    directives: [Infobox, ServerStats, ServerAvg, StationsMap, StationsGrid, Loading],
    selector: 'Dashboard',
    pipes: [SortBy],
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
        this.listenStore()
    }

    private stations:Map<string, List<StationModel>>;
    private unsubs:Array<()=>void> = [];
    private businessStats = {};
    private serverStats;
    private serverAvgResponse;
    private serverStatsCategories;
    private stationsFiltered:List<StationModel>;
    private stationsFilteredBy = {
        connected: 'all',
        business: 'all',
        os: 'all',
        airVersion: 'all',
        appVersion: 'all'
    }
    private stationsFilter = {
        os: [],
        airVersion: [],
        appVersion: []
    };

    routerOnActivate(to:ComponentInstruction, from:ComponentInstruction) {
    }

    private listenStore() {
        var unsub;

        /** stations stats **/
        this.stations = this.appStore.getState().stations;
        this.initStationsFilter();
        unsub = this.appStore.sub((stations:Map<string, List<StationModel>>) => {
            this.stations = stations;
            this.initStationsFilter();
        }, 'stations');
        this.unsubs.push(unsub);

        /** business stats **/
        this.businessStats = this.appStore.getState().business.getIn(['businessStats']) || {};
        unsub = this.appStore.sub((i_businesses:Map<string,any>) => {
            this.businessStats = i_businesses;
        }, 'business.businessStats');
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

    private initStationsFilter() {
        this.stations.forEach((stationList:List<StationModel>, source)=> {
            stationList.forEach((i_station:StationModel)=> {
                this.stationsFilter['os'].push(i_station.getKey('os'));
                this.stationsFilter['appVersion'].push(i_station.getKey('appVersion'));
                this.stationsFilter['airVersion'].push(i_station.getKey('airVersion'));
            })
        });
        this.stationsFilter['os'] = _.uniq(this.stationsFilter['os']).filter(function (n) {
            return n != ''
        });
        this.stationsFilter['appVersion'] = _.uniq(this.stationsFilter['appVersion']).filter(function (n) {
            return n != ''
        });
        this.stationsFilter['airVersion'] = _.uniq(this.stationsFilter['airVersion']).filter(function (n) {
            return n != ''
        });
    }

    private onStationsFilterSelected(filterType, filterValue){
        this.stationsFiltered = List<StationModel>();;
        this.stationsFilteredBy[filterType] = filterValue;
        this.stations.forEach((stationList:List<StationModel>, source)=> {
            stationList.forEach((i_station:StationModel)=> {
                var os = i_station.getKey('os');
                var appVersion = i_station.getKey('appVersion');
                var airVersion = i_station.getKey('airVersion');
                var connection = i_station.getKey('connection');
                var name = i_station.getKey('name');
                var r = _.random(1,2)
                if (r==1)
                    this.stationsFiltered = this.stationsFiltered.push(i_station)
            })
        });

    }

    private ngOnDestroy() {
        this.unsubs.forEach((unsub:()=>void)=> {
            unsub();
        })
    }
}


// import {createSelector} from 'reselect';
// const stationSelector = createSelector(function (state) {
//     return state
// }, function (stations:Map<any,List<any>>) {
//     var stationsFilter = {
//         os: [],
//         airVersion: [],
//         appVersion: []
//     };
//     stations.forEach((stationList:List<StationModel>, source)=> {
//         stationList.forEach((i_station:StationModel)=> {
//             stationsFilter['os'].push(i_station.getKey('os'));
//             stationsFilter['appVersion'].push(i_station.getKey('appVersion'));
//             stationsFilter['airVersion'].push(i_station.getKey('airVersion'));
//         })
//     });
//     return stations;
// })
