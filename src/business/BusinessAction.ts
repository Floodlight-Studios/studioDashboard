import {Http, Jsonp} from "angular2/http";
import {Injectable} from "angular2/core";
import {Actions, AppStore} from "angular2-redux-util";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/merge';
import {BusinessModel} from "./BusinessModel";
import {List} from 'immutable';
import {BusinessUser} from "./BusinessUser";
import {Subject} from "rxjs/Subject";

export const REQUEST_BUSINESS_USER = 'REQUEST_BUSINESS_USER';
export const RECEIVE_BUSINESS_USER = 'RECEIVE_BUSINESS_USER';
export const REQUEST_BUSINESSES = 'REQUEST_BUSINESSES';
export const RECEIVE_BUSINESSES = 'RECEIVE_BUSINESSES';
export const RECEIVE_BUSINESSES_STATS = 'RECEIVE_BUSINESSES_STATS';
export const SET_BUSINESS_DATA = 'SET_BUSINESS_DATA';

@Injectable()
export class BusinessAction extends Actions {
    parseString;
    httpRequest$:Subject<any>;
    unsub;

    constructor(private _http:Http, private appStore:AppStore) {
        super();
        this.parseString = require('xml2js').parseString;
        this.listenFetchBusinessUser();
    }

    private listenFetchBusinessUser(){
        var self = this;
        this.httpRequest$ = new Subject();
        this.unsub = this.httpRequest$
            .map(v=> {
                return v;
            })
            .switchMap((v:any):any => {
                console.log(v);
                if (v.businessId==-1||v.businessId=='-1')
                    return 'CANCEL_PENDING_NET_CALLS';
                var businessId = v.businessId;
                var dispatch = v.dispatch;
                var appdb:Map<string,any> = this.appStore.getState().appdb;
                var url = appdb.get('appBaseUrlUser') + `&command=GetBusinessUsers&businessList=${businessId}`;
                return this._http.get(url)
                    .map(result => {
                        var xmlData:string = result.text()
                        xmlData = xmlData.replace(/}\)/, '').replace(/\(\{"result":"/, '');
                        this.parseString(xmlData, {attrkey: '_attr'}, function (err, result) {
                            const businessUser:BusinessUser = new BusinessUser({
                                accessMask: result.Users.User["0"]._attr.accessMask,
                                privilegeId: result.Users.User["0"]._attr.privilegeId,
                                emailName: result.Users.User["0"]._attr.name,
                                businessId: result.Users.User["0"]._attr.businessId,
                            });
                            dispatch(self.receiveBusinessUser(businessUser));
                        });
                    });
            }).share()
            .subscribe();
    }

    public fetchBusinessUser(...args) {
        var businessId = args[0];
        return (dispatch) => {
            dispatch(this.requestBusinessUser());
            this.httpRequest$.next({businessId: businessId, dispatch: dispatch});
        };
    }

    public findBusinessIndex(business:BusinessModel, businesses:List<BusinessModel>):number {
        return businesses.findIndex((i_business:BusinessModel)=> {
            return i_business.getKey('businessId') === business.getKey('businessId');
        });
    }

    /**
     * Redux middleware action for getting server businesses
     * **/
    public fetchBusinesses(...args) {
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
                    this.parseString(xmlData, {attrkey: '_attr'}, function (err, result) {
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

    public setBusinessField(businessId:string, key:string, value:any) {
        return {
            type: SET_BUSINESS_DATA,
            businessId: businessId,
            key: key,
            value: value
        }
    }

    public requestBusinessUser() {
        return {type: REQUEST_BUSINESS_USER};
    }

    public requestBusinesses() {
        return {type: REQUEST_BUSINESSES};
    }

    public receiveBusinesses(businesses) {
        return {
            type: RECEIVE_BUSINESSES,
            businesses
        }
    }

    public receiveBusinessUser(business:BusinessUser) {
        return {
            type: RECEIVE_BUSINESS_USER,
            business
        }
    }

    public receiveBusinessesStats(stats) {
        return {
            type: RECEIVE_BUSINESSES_STATS,
            stats
        }
    }

    ngOnDestroy() {
        this.unsub();
    }

}
