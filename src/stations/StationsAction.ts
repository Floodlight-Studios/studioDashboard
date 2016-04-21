import {Injectable} from "angular2/core";
import {Actions, AppStore} from "angular2-redux-util";
import {Observable} from "rxjs/Observable";
import {List, Map} from 'immutable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';
import 'rxjs/add/observable/throw';
import {
    Headers,
    Http,
    Jsonp,
    Response,
    HTTP_BINDINGS,
    Request,
    RequestOptions,
    RequestMethod,
    RequestOptionsArgs
} from 'angular2/http'
import {StationModel} from "./StationModel";
import {CommBroker} from "../services/CommBroker";
import {Consts} from "../Conts";
const _ = require('underscore');
const bootbox = require('bootbox');


export const RECEIVE_STATIONS = 'RECEIVE_STATIONS';
export const RECEIVE_TOTAL_STATIONS = 'RECEIVE_TOTAL_STATIONS';

@Injectable()
export class StationsAction extends Actions {

    constructor(private appStore:AppStore, private _http:Http, private jsonp:Jsonp, private commBroker:CommBroker) {
        super(appStore);
        this.m_parseString = require('xml2js').parseString;
        // this.listenFetchBusinessUser();
    }

    private m_parseString;

    public getStationsInfo(config) {
        var self = this;
        return (dispatch)=> {
            var totalStations = 0;
            var observables:Array<Observable<any>> = [];
            for (let i_source in config) {
                var i_businesses = config[i_source];
                var businesses = i_businesses.join(',');

                //todo: need to add user auth for getSocketStatusList
                var url:string = `http://${i_source}/WebService/StationService.asmx/getSocketStatusList?i_businessList=${businesses}`;
                // console.log(url);
                observables.push(this._http.get(url).retry(0).map((res) => {
                    return {xml: res.text(), source: i_source};
                }));
            }
            Observable.forkJoin(observables).subscribe(
                (data:Array<any>) => {
                    data.forEach((i_data)=> {
                        var source = i_data.source;
                        var xmlData:string = i_data.xml;
                        xmlData = xmlData.replace(/&lt;/ig, '<').replace(/&gt;/ig, '>');
                        this.m_parseString(xmlData, {attrkey: '_attr'}, function (err, result) {
                            if (err) {
                                bootbox.alert('problem loading station info')
                                return;
                            }
                            /**
                             * redux inject stations sources
                             **/
                            var stations:List<StationModel> = List<StationModel>();
                            if (result.string.SocketStatus["0"].Business) {
                                result.string.SocketStatus["0"].Business.forEach((business)=> {
                                    var businessId = business._attr.businessId;
                                    if (business.Stations["0"].Station) {
                                        business.Stations["0"].Station.forEach((station)=> {
                                            var stationData = {
                                                businessId: businessId,
                                                source: source,
                                                airVersion: station._attr.airVersion,
                                                appVersion: station._attr.appVersion,
                                                caching: station._attr.caching,
                                                localIp: station._attr.localAddress,
                                                publicIp: station._attr.publicIp,
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
                                    }
                                })
                            }
                            totalStations = totalStations + stations.size;
                            dispatch(self.receiveStations(stations, source));
                        });
                    })
                },
                (err:Response) => {
                    err = err.json();
                    var status = err['currentTarget'].status;
                    var statusText = err['currentTarget'].statusText;
                    this.commBroker.fire({
                        fromInstance: this,
                        event: Consts.Events().STATIONS_NETWORK_ERROR,
                        context: this,
                        message: ''
                    });
                },
                ()=> {
                    dispatch(self.receiveTotalStations(totalStations));
                }
            );
        }
    }

    public getStationsIps() {
        var self = this;
        return (dispatch)=> {
            var stationsIps = [];
            var stations:Map<string, List<StationModel>> = this.appStore.getState().stations;
            stations.forEach((stationList:List<StationModel>, source)=> {
                stationList.forEach((i_station:StationModel)=> {
                    var ip = i_station.getKey('publicIp');
                    var id = i_station.getKey('id');
                    if (!_.isEmpty(ip))
                        stationsIps.push({id,ip})
                })
            });
            var body = JSON.stringify(stationsIps);
            var basicOptions:RequestOptionsArgs = {
                url: 'https://secure.digitalsignage.com/getGeoByIp',
                headers: new Headers({'Content-Type': 'application/json'}),
                method: RequestMethod.Post,
                body: body
            };
            var reqOptions = new RequestOptions(basicOptions);
            var req = new Request(reqOptions);
            this._http.request(req)
                .catch((err) => {
                    bootbox.alert('Error loading station IPs 1');
                    // return Observable.of(true);
                    return Observable.throw(err);
                })
                .finally(() => {
                    // console.log('done');
                })
                .map(result => {
                    var stations = result.json();
                    for (var station in stations) {
                        var current = stations[station];
                        var rand = _.random(0, 30) / 100;
                        current.lat = current.lat + rand;
                        current.lon = current.lon + rand;
                    }
                    //this.highCharts.series[1].setData(stations);
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

    public receiveTotalStations(totalStations:number) {
        return {
            type: RECEIVE_TOTAL_STATIONS,
            totalStations
        }
    }
}

// let observables = [
//     this._http.get('/app/books.json').map((res:Response) => res.json()),
//     this.http.get('/app/movies.json').map((res:Response) => res.json())
// ];
//

// private businessesRequest$;
// private unsub;


// demo
// var s = ['https://neptune.signage.me','https://earth.signage.me','https://moon.signage.me']
// this.appStore.dispatch(this.stationsAction.fetchBusinessUser(s));
// setTimeout(()=>{
// // this.appStore.dispatch(this.stationsAction.fetchBusinessUser([]));
// },100)

// demo
// private listenFetchBusinessUser() {
//     this.businessesRequest$ = new Subject();
//     this.unsub = this.businessesRequest$
//         .map(v=> {
//             return v;
//         })
//         .debounceTime(100)
//         .switchMap((values:{servers:Array<string>, dispatch:(value:any)=>any}):any => {
//             if (values.servers.length == 0)
//                 return 'CANCEL_PENDING_NET_CALLS';
//             var dispatch = values.dispatch;
//             return values.servers.map(i_source => {
//                 var url:string = 'https://galaxy.signage.me/WebService/ResellerService.ashx?command=GetCustomers&resellerUserName=rs@ms.com&resellerPassword=rrr'
//                 return this._http.get(url)
//                     .map(result => {
//                         console.log(result);
//                     }).subscribe((res)=> {
//                     }, err=> {
//                         console.log(err);
//                     }, ()=> {
//                         console.log();
//                     });
//             })
//
//         }).share()
//         .subscribe();
// }

// demo
// public fetchBusinessUser(servers:Array<string>) {
//     Observable.forkJoin(
//         this._http.get('https://galaxy.signage.me/WebService/ResellerService.ashx?command=GetCustomers&resellerUserName=rs@ms.com&resellerPassword=rrr'),
//         this._http.get('https://galaxy.signage.me/WebService/ResellerService.ashx?command=GetCustomers&resellerUserName=rs@ms.com&resellerPassword=rrr')
//     ).subscribe(
//         data => {
//             console.log(data);
//         },
//         err => console.error(err)
//     );
//
//     return (dispatch) => {
//         this.businessesRequest$.next({servers: servers, dispatch: dispatch});
//     };
// }

// public getStationsInfo(i_source:string, i_businesses:Array<any>) {
//     var self = this;
//     return (dispatch)=> {
//         var businesses = i_businesses.join(',');
//         var url:string = `http://${i_source}/WebService/StationService.asmx/getSocketStatusList?i_businessList=${businesses}`;
//         this._http.get(url)
//             .map(result => {
//                 var xmlData:string = result.text()
//                 xmlData = xmlData.replace(/&lt;/ig, '<').replace(/&gt;/ig, '>');
//                 this.m_parseString(xmlData, {attrkey: '_attr'}, function (err, result) {
//                     if (err) {
//                         bootbox.alert('problem loading station info')
//                         return;
//                     }
//                     /**
//                      * redux inject stations sources
//                      **/
//                     var stations:List<StationModel> = List<StationModel>();
//                     result.string.SocketStatus["0"].Business.forEach((business)=> {
//                         var businessId = business._attr.businessId;
//                         business.Stations["0"].Station.forEach((station)=> {
//                             var stationData = {
//                                 businessId: businessId,
//                                 source: i_source,
//                                 airVersion: station._attr.airVersion,
//                                 appVersion: station._attr.appVersion,
//                                 caching: station._attr.caching,
//                                 cameraStatus: station._attr.cameraStatus,
//                                 connection: station._attr.connection,
//                                 id: station._attr.id,
//                                 lastCameraTest: station._attr.lastCameraTest,
//                                 lastUpdate: station._attr.lastUpdate,
//                                 name: station._attr.name,
//                                 os: station._attr.os,
//                                 peakMemory: station._attr.peakMemory,
//                                 runningTime: station._attr.runningTime,
//                                 socket: station._attr.socket,
//                                 startTime: station._attr.startTime,
//                                 status: station._attr.status,
//                                 totalMemory: station._attr.totalMemory,
//                                 watchDogConnection: station._attr.watchDogConnection
//                             };
//                             var stationModel:StationModel = new StationModel(stationData)
//                             stations = stations.push(stationModel);
//                         })
//                     })
//                     dispatch(self.receiveStations(stations, i_source));
//                 });
//             }).subscribe(
//             data => {
//             },
//             err => {
//                 var stationModel:StationModel = new StationModel({})
//                 var stations:List<StationModel> = List<StationModel>();
//                 stations = stations.push(stationModel);
//                 dispatch(self.receiveStations(stations, i_source));
//             },
//             () => {
//             }
//         );
//     }
// }