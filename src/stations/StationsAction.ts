import {Injectable} from "angular2/core";
import {Actions, AppStore} from "angular2-redux-util";
import {Http, Jsonp} from "angular2/http";
import {Lib} from "../Lib";
import {List, Map} from 'immutable';
import {StationModel} from "./StationModel";
const Immutable = require('immutable');
const _ = require('underscore');

export const RECEIVE_STATIONS = 'RECEIVE_STATIONS';

@Injectable()
export class StationsAction extends Actions {

    constructor(private appStore:AppStore, private _http:Http, private jsonp:Jsonp) {
        super(appStore);
        this.m_parseString = require('xml2js').parseString;
    }

    private m_parseString;
    
    public getStationsInfo(i_source:string, i_businesses:Array<any>) {
        var self = this;
        return (dispatch)=> {
            //todo: need to add user auth for getSocketStatusList
            var businesses = i_businesses.join(',');
            var url:string = `http://${i_source}/WebService/StationService.asmx/getSocketStatusList?i_businessList=${businesses}`;
            //todo: ignore mars until bug fixed
            if (i_source == 'mars.signage.me')
                return;
            // old accounts may have left overs
            if (i_source == 'mercury.signage.me')
                return;
            this._http.get(url)
                .map(result => {
                    var xmlData:string = result.text()
                    xmlData = xmlData.replace(/&lt;/ig, '<').replace(/&gt;/ig, '>');
                    this.m_parseString(xmlData, {attrkey: '_attr'}, function (err, result) {
                        if (err) {
                            bootbox.alert('problem loading user info')
                            return;
                        }
                        /**
                         * redux inject stations sources
                         **/
                        var stations:List<StationModel> = List<StationModel>();
                        result.string.SocketStatus["0"].Business.forEach((business)=> {
                            var businessId = business._attr.businessId;
                            business.Stations["0"].Station.forEach((station)=> {
                                var stationData = {
                                    businessId: businessId,
                                    source: i_source,
                                    airVersion: station._attr.airVersion,
                                    appVersion: station._attr.appVersion,
                                    caching: station._attr.caching,
                                    cameraStatus: station._attr.cameraStatus,
                                    connection: station._attr.connection,
                                    id: station._attr.id,
                                    lastCameraTest: station._attr.lastCameraTest,
                                    lastUpdate: station._attr.lastUpdate,
                                    name: station._attr.name,
                                    os: station._attr.os,
                                    peakMemory: station._attr.peakMemory,
                                    runningTime: station._attr.runningTime,
                                    socket: station._attr.socket,
                                    startTime: station._attr.startTime,
                                    status: station._attr.status,
                                    totalMemory: station._attr.totalMemory,
                                    watchDogConnection: station._attr.watchDogConnection
                                };
                                var stationModel:StationModel = new StationModel(stationData)
                                stations = stations.push(stationModel);
                            })
                        })
                        dispatch(self.receiveStations(stations, i_source));
                    });
                }).subscribe();
        }
    }

    public receiveStations(stations:List<StationModel>, source) {
        return {
            type: RECEIVE_STATIONS,
            stations,
            source
        }
    }

}
