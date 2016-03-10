import {Http, Jsonp} from "angular2/http";
import {Injectable} from "angular2/core";
import {Actions, AppStore} from "angular2-redux-util";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/debounceTime';
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
export const CHANGE_BUSINESS_USER_NAME = 'CHANGE_BUSINESS_USER_NAME';
export const SET_BUSINESS_USER_ACCESS = 'SET_BUSINESS_USER_ACCESS';

@Injectable()
export class BusinessAction extends Actions {
    parseString;
    businessesRequest$:Subject<any>;
    unsub;

    constructor(private _http:Http, private appStore:AppStore) {
        super();
        this.parseString = require('xml2js').parseString;
        this.listenFetchBusinessUser();
    }

    private listenFetchBusinessUser() {
        var self = this;
        this.businessesRequest$ = new Subject();
        this.unsub = this.businessesRequest$
            .map(v=> {
                return v;
            })
            .debounceTime(100)
            .switchMap((values:{businessIds:Array<string>, dispatch:(value:any)=>any}):any => {
                if (values.businessIds.length == 0)
                    return 'CANCEL_PENDING_NET_CALLS';
                var businessIds:string = values.businessIds.join('.');
                var dispatch = values.dispatch;
                var appdb:Map<string,any> = this.appStore.getState().appdb;
                var url = appdb.get('appBaseUrlUser') + `&command=GetBusinessUsers&businessList=${businessIds}`;
                return this._http.get(url)
                    .map(result => {
                        var xmlData:string = result.text()
                        xmlData = xmlData.replace(/}\)/, '').replace(/\(\{"result":"/, '');
                        this.parseString(xmlData, {attrkey: '_attr'}, function (err, result) {
                            var businessUsers:List<BusinessUser> = List<BusinessUser>();
                            for (var business of result.Users.User) {
                                const businessUser:BusinessUser = new BusinessUser({
                                    accessMask: business._attr.accessMask,
                                    privilegeId: business._attr.privilegeId,
                                    name: business._attr.name,
                                    businessId: business._attr.businessId,
                                });
                                businessUsers = businessUsers.push(businessUser)
                            }
                            dispatch(self.receiveBusinessUsers(businessUsers));
                        });
                    });
            }).share()
            .subscribe();
    }

    public fetchBusinessUser(businessIds:Array<string>) {
        return (dispatch) => {
            dispatch(this.requestBusinessUser());
            this.businessesRequest$.next({businessIds: businessIds, dispatch: dispatch});
        };
    }

    public findBusinessIndex(business:BusinessModel|BusinessUser, businesses:List<BusinessModel|BusinessUser>):number {
        return businesses.findIndex((i_business:BusinessModel|BusinessUser)=> {
            return i_business.getBusinessId() === business.getBusinessId();
        });
    }

    public findBusinessIndexById(businessId:string, businesses:List<BusinessModel|BusinessUser>):number {
        return businesses.findIndex((i_business:BusinessModel|BusinessUser)=> {
            return businessId === i_business.getBusinessId();
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
                        var businssess = [], businessIds = [];
                        result.Businesses.BusinessInfo.forEach((business)=> {
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
                            businessIds.push(business._attr.businessId)
                            businssess.push(bus);
                        });
                        accountStats.totalBusinesses = businssess.length;

                        dispatch(self.receiveBusinesses(businssess));
                        dispatch(self.receiveBusinessesStats(accountStats));
                        dispatch(self.fetchBusinessUser(businessIds));

                        // example of setting and getting businessId
                        // var businessId = businessModel.getBusinessId();
                        // var newBusinessModel = businessModel.setBusinessId('123')

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
                        //        // this is an update of field in instance via setKey
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

    public setBusinessUserName(businessId:string, key:string, value:any) {
        return {
            type: CHANGE_BUSINESS_USER_NAME,
            businessId: businessId,
            key: key,
            value: value
        }
    }

    public saveBusinessUserAccess(businessId:string, name:any, accessMask:number, privilegeId:number) {
        return (dispatch)=> {
            var appdb:Map<string,any> = this.appStore.getState().appdb;
            var url = appdb.get('appBaseUrlUser') + `&command=UpdateUserPrivilege&privilegeId=${privilegeId}&accessMask=${accessMask}&customerUserName=${name}`;
            console.log(url);
            this._http.get(url)
                .map(result => {
                    var xmlData:string = result.text()
                    xmlData = xmlData.replace(/}\)/, '').replace(/\(\{"result":"/, '');
                    dispatch(this.savedBusinessUserAccess({
                        businessId: businessId,
                        privilegeId: privilegeId,
                        accessMask: accessMask,
                        name: name
                    }))
                }).subscribe();
        }
    }

    private savedBusinessUserAccess(i_payload) {
        return {
            type: SET_BUSINESS_USER_ACCESS,
            payload: i_payload
        };
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

    public receiveBusinessUsers(businessUsers:List<BusinessUser>) {
        return {
            type: RECEIVE_BUSINESS_USER,
            businessUsers
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
