import {Http, Jsonp} from "angular2/http";
import {Injectable} from "angular2/core";
import {Actions, AppStore} from "angular2-redux-util";
import 'rxjs/add/operator/map';
import {BusinessModel} from "./BusinesModel";
import {Lib} from "../Lib";
import {List} from 'immutable';
import * as _ from 'lodash';

export const REQUEST_BUSINESSES = 'REQUEST_BUSINESSES';
export const RECEIVE_BUSINESSES = 'RECEIVE_BUSINESSES';
export const RECEIVE_BUSINESSES_STATS = 'RECEIVE_BUSINESSES_STATS';
export const REQUEST_FILM = 'REQUEST_FILM';
export const RECEIVE_FILM = 'RECEIVE_FILM';
export const CURRENT_FILMS = 'CURRENT_FILMS';
export const RECEIVE_NUMBER_OF_FILMS = 'RECEIVE_NUMBER_OF_FILMS';
export const SET_BUSINESS_DATA = 'SET_BUSINESS_DATA';


@Injectable()
export class BusinessAction extends Actions {

    constructor(private _http:Http, private appStore:AppStore) {
        super();
    }

    findBusinessIndex(business:BusinessModel, businesses:List<BusinessModel>):number {
        return businesses.findIndex((i_business:BusinessModel)=> {
            return i_business.getKey('businessId') === business.getKey('businessId');
        });
    }

    /**
     * Redux middleware action for getting server businesses
     * **/
    fetchBusinesses(...args) {
        var self = this;
        return (dispatch) => {
            dispatch(this.requestBusinesses());
            const accountStats = {
                lites: 0,
                pros: 0,
                activeAccounts: 0,
                inactiveAccounts: 0,
                lastLogin: 0,
                totalBusinesses: 0
            }
            var appdb:Map<string,any> = this.appStore.getState().appdb;
            var url = appdb.get('appBaseUrlUser') + '&command=GetCustomers';
            this._http.get(url)
                .map(result => {
                    var xmlData:string = result.text()
                    xmlData = xmlData.replace(/}\)/, '').replace(/\(\{"result":"/, '');
                    var parseString = require('xml2js').parseString;
                    parseString(xmlData, {attrkey: '_attr'}, function (err, result) {
                        var arr = [], c = 0;
                        result.Businesses.BusinessInfo.forEach((business)=> {
                            c++;
                            // var max = _.random(1,15);
                            var max = 100000;
                            if (c > max)
                                return;
                            // create new
                            var bus:BusinessModel = new BusinessModel({
                                businessId: business._attr.businessId,
                                name: business._attr.name,
                                accountStatus: business._attr.accountStatus,
                                applicationId: business._attr.applicationId,
                                archiveState: business._attr.archiveState,
                                fromTemplateId: business._attr.fromTemplateId,
                                maxMonitors: business._attr.maxMonitors,
                                maxDataStorage: business._attr.maxDataStorage,
                                allowSharing: business._attr.allowSharing,
                                studioLite: business._attr.studioLite,
                                lastLogin: business._attr.lastLogin,
                                resellerId: business._attr.resellerId,
                                businessDescription: business._attr.businessDescription
                            });

                            // collect stats
                            business._attr.accountStatus == 2 ? accountStats.activeAccounts++ : accountStats.inactiveAccounts++;
                            business._attr.studioLite == 0 ? accountStats.pros++ : accountStats.lites++;
                            business._attr.accountStatus == 2 ? accountStats.activeAccounts++ : accountStats.inactiveAccounts++;
                            var lastLogin = Number(business._attr.lastLogin);
                            if (lastLogin > accountStats.lastLogin) {
                                accountStats.lastLogin = business._attr.lastLogin;
                            }

                            arr.push(bus);

                            // example update a field in instance via setKey
                            //var busUpd:BusinessModel = bus.setKey<BusinessModel>(BusinessModel, 'businessId', business._attr.businessId + Math.random());
                            // insert a new field in instance
                            //busUpd = busUpd.setKey<BusinessModel>(BusinessModel, 'JS', 'Ninja');
                            // override entire instance with new data via setData
                            //var busUpd:BusinessModel = bus.setData<BusinessModel>(BusinessModel, {
                            //    businessId: business.attr.businessId + Math.random(),
                            //});
                        });
                        accountStats.totalBusinesses = arr.length;

                        dispatch(self.receiveBusinesses(arr));
                        dispatch(self.receiveBusinessesStats(accountStats));

                        //parseString(result, {attrkey: 'attr'}, function (err, result) {
                        //    var arr = [];
                        //    result.Businesses[0].BusinessInfo.forEach((business)=> {
                        //        // create new
                        //        var bus:BusinessModel = new BusinessModel({
                        //            businessId: business.attr.businessId,
                        //            name: business.attr.name,
                        //            accountStatus: business.attr.accountStatus,
                        //            applicationId: business.attr.applicationId,
                        //            archiveState: business.attr.archiveState,
                        //            fromTemplateId: business.attr.fromTemplateId,
                        //            maxMonitors: business.attr.maxMonitors,
                        //            maxDataStorage: business.attr.maxDataStorage,
                        //            allowSharing: business.attr.allowSharing,
                        //            studioLite: business.attr.studioLite,
                        //            lastLogin: business.attr.lastLogin,
                        //            resellerId: business.attr.resellerId,
                        //            businessDescription: business.attr.businessDescription
                        //        });
                        //
                        //        // update a field in instance via setKey
                        //        var busUpd:BusinessModel = bus.setKey<BusinessModel>(BusinessModel, 'businessId', business.attr.businessId + Math.random());
                        //
                        //        // insert a new field in instance
                        //        busUpd = busUpd.setKey<BusinessModel>(BusinessModel, 'JS', 'Ninja');
                        //
                        //        // override entire instance with new data via setData
                        //        //var busUpd:BusinessModel = bus.setData<BusinessModel>(BusinessModel, {
                        //        //    businessId: business.attr.businessId + Math.random(),
                        //        //});
                        //        arr.push(busUpd);
                        //
                        //    });
                        //    dispatch(self.receiveBusinesses(arr));
                        //});

                        //var xResult = jQuery(result);
                        //var businesses = xResult.find('BusinessInfo');
                        //console.log(result)

                    });


                }).subscribe();
            //.map(json => {
            //    dispatch(this.receiveBusinesses(json.results));
            //    dispatch(this.receiveNumberOfFilms(json.count));
            //})

        };
    }

    setBusinessField(businessId:string, key:string, value:any) {
        return {
            type: SET_BUSINESS_DATA,
            businessId: businessId,
            key: key,
            value: value
        }
    }

    // fetchBusiness(index) {
    //     return (dispatch) => {
    //         dispatch(this.requestFilm());
    //         this._http.get(`${BASE_URL}${index + 1}/`)
    //             .map(result => result.json())
    //             .map(json => {
    //                 dispatch(this.receiveFilm(json));
    //             })
    //             .subscribe();
    //     };
    // }

    requestBusinesses() {
        return {type: REQUEST_BUSINESSES};
    }

    receiveBusinesses(businesses) {
        return {
            type: RECEIVE_BUSINESSES,
            businesses
        }
    }

    receiveBusinessesStats(stats) {
        return {
            type: RECEIVE_BUSINESSES_STATS,
            stats
        }
    }

    receiveNumberOfFilms(count) {
        return {
            type: RECEIVE_NUMBER_OF_FILMS,
            count
        }
    }

    requestFilm() {
        return {type: REQUEST_FILM};
    }

    receiveFilm(film) {
        return {
            type: RECEIVE_FILM,
            film
        }
    }


}
