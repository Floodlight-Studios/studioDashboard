import {Injectable} from "angular2/core";
import {Actions, AppStore} from "angular2-redux-util";
import {Http, Jsonp} from "angular2/http";
import {Lib} from "../Lib";
import {List, Map} from 'immutable';
const Immutable = require('immutable');
const _ = require('underscore');

// export const RECEIVE_PRIVILEGES = 'RECEIVE_PRIVILEGES';

@Injectable()
export class StationsAction extends Actions {

    constructor(private appStore:AppStore, private _http:Http, private jsonp:Jsonp) {
        super(appStore);
        this.m_parseString = require('xml2js').parseString;
    }

    private m_parseString;

    public getStationsInfo() {
        var self = this;
        return (dispatch)=> {
            var appdb:Map<string,any> = this.appStore.getState().appdb;
            //todo: need to add user auth for getSocketStatusList
            // var url = appdb.get('appBaseUrlUser') + `&command=GetBusinessUserInfo`;
            var url:string = 'http://eris.signage.me/WebService/StationService.asmx/getSocketStatusList?i_businessList=315757';
            this._http.get(url)
                .map(result => {
                    var xmlData:string = result.text()
                    xmlData = xmlData.replace(/&lt;/ig, '<').replace(/&gt;/ig, '>');
                    this.m_parseString(xmlData, {attrkey: '_attr'}, function (err, result) {
                        if (err) {
                            bootbox.alert('problem loading user info')
                            return;
                        }
                        _.forEach(result.string.SocketStatus["0"].Business["0"].Stations["0"].Station, (value)=> {
                        })
                        /**
                         * redux inject server sources
                         **/
                        // var serverSources:List<SourcesModel> = List<SourcesModel>();
                        // _.forEach(result.User.BusinessInfo["0"].Sources["0"].SourceInfo, (value)=> {
                        //     var source = {
                        //         id: value._attr.id,
                        //         serverType: value._attr.serverName,
                        //         socketDomain: value._attr.socketDomain,
                        //         businessDomain: value._attr.businessDomain,
                        //         source: value._attr.businessDomain.split('.')[0],
                        //         businessDbName: value._attr.businessDbName
                        //     }
                        //     serverSources = serverSources.push(new SourcesModel(source));
                        // })
                        // dispatch(self.receiveServerSources(serverSources));

                    });
                }).subscribe();
        }
    }

}
