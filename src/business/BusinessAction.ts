import {Http, Jsonp} from "angular2/http";
import {Injectable} from "angular2/core";
import {Actions, AppStore} from "angular2-redux-util";
import {BusinessModel} from "./BusinessModel";
import {Map, List} from 'immutable';
import {BusinessUser} from "./BusinessUser";
import {Subject} from "rxjs/Subject";
import {BusinessSourcesModel} from "./BusinessSourcesModel";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';
import 'rxjs/add/observable/throw';
import {SampleModel} from "../business/SampleModel";
import {Lib} from "../Lib";
const bootbox = require('bootbox');
const _ = require('underscore');

export const REQUEST_BUSINESS_USER = 'REQUEST_BUSINESS_USER';
export const RECEIVE_BUSINESSES_SOURCES = 'RECEIVE_BUSINESSES_SOURCES';
export const RECEIVE_BUSINESS_USER = 'RECEIVE_BUSINESS_USER';
export const RECEIVE_BUSINESS_SAMPLES = 'RECEIVE_BUSINESS_SAMPLES';
export const REQUEST_BUSINESSES = 'REQUEST_BUSINESSES';
export const RECEIVE_BUSINESSES = 'RECEIVE_BUSINESSES';
export const RECEIVE_BUSINESSES_STATS = 'RECEIVE_BUSINESSES_STATS';
export const SET_BUSINESS_DATA = 'SET_BUSINESS_DATA';
export const SET_BUSINESS_ACCOUNT_DATA = 'SET_BUSINESS_ACCOUNT_DATA';
export const CHANGE_BUSINESS_USER_NAME = 'CHANGE_BUSINESS_USER_NAME';
export const SET_BUSINESS_USER_ACCESS = 'SET_BUSINESS_USER_ACCESS';
export const ADD_BUSINESS_USER = 'ADD_BUSINESS_USER';
export const REMOVE_BUSINESS = 'REMOVE_BUSINESS';
export const REMOVE_BUSINESS_USER = 'REMOVE_BUSINESS_USER';

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
                        // xmlData = xmlData.replace(/}\)/, '').replace(/\(\{"result":"/, '');
                        this.parseString(xmlData, {attrkey: '_attr'}, function (err, result) {
                            var businessUsers:List<BusinessUser> = List<BusinessUser>();
                            for (var business of result.Users.User) {
                                const businessUser:BusinessUser = new BusinessUser({
                                    accessMask: business._attr.accessMask,
                                    privilegeId: business._attr.privilegeId,
                                    password: '',
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

    public getSamples() {
        var self = this;
        return (dispatch)=> {
            var appdb:Map<string,any> = this.appStore.getState().appdb;

            // todo: Enable this later when we move sample list to a web service, for now we do it via static content
            // this._http.get('http://galaxy.signage.me/WebService/getResellerTemplates.ashx?resellerId=1&ver=2')
            //     .map(result => {
            //         var sampleData:any = result.text().replace('templates','"templates"');
            //         sampleData = JSON.parse(sampleData);
            //         var samples = [];
            //         sampleData.templates.forEach((v)=>{
            //             var sampleModel = new SampleModel(v);
            //             samples.push(sampleModel);
            //         })
            //         var sampleModels:List<SampleModel> = List(samples);
            //         dispatch(this.receiveBusinessSamples(sampleModels));
            //     }).subscribe();

            var sampleData = Lib.GetSamples();
            var samples = [];
            _.forEach(sampleData, (v, businessId)=> {
                var name = v.split(',')[0]
                var type = v.split(',')[1]
                var sampleModel = new SampleModel({businessId, name, type});
                samples.push(sampleModel);
            })
            var sampleModels:List<SampleModel> = List(samples);
            dispatch(this.receiveBusinessSamples(sampleModels));
        }
    }

    public updateAccount(businessId:string, name:string, maxMonitors:string, allowSharing:string) {
        return (dispatch)=> {
            dispatch(this.saveAccountInfo({businessId, name, maxMonitors, allowSharing}));
            var appdb:Map<string,any> = this.appStore.getState().appdb;
            var url;
            url = appdb.get('appBaseUrlUser') + `&command=UpdateAccount&buinessId=${businessId}&businessName=${name}&maxMonitors=${maxMonitors}&allowSharing=${allowSharing}`;
            this._http.get(url)
                .catch((err) => {
                    bootbox.alert('Error updating account');
                    return Observable.throw(err);
                })
                .finally(() => {
                })
                .map(result => {
                    var reply:any = result.text();
                    if (reply == 'True') {
                    } else {
                        bootbox.alert('Problem updating the selected account');
                    }
                }).subscribe();
        }
    }

    public getStudioProUrl(customerUserName:string, cb:(url:string)=>void) {
        var appdb:Map<string,any> = this.appStore.getState().appdb;
        var url;
        url = appdb.get('appBaseUrlUser') + `&command=GetLoginKey&customerUserName=${customerUserName}`;
        this._http.get(url)
            .catch((err) => {
                bootbox.alert('Problem launching StudioPro');
                return Observable.throw(err);
            })
            .finally(() => {
            })
            .map(result => {
                var reply:string = result.text();
                cb(reply)
            }).subscribe();
    }

    public removeBusiness(businessId:number) {
        return (dispatch)=> {
            var appdb:Map<string,any> = this.appStore.getState().appdb;
            var url;
            url = appdb.get('appBaseUrlUser') + `&command=DeleteAccount&buinessId=${businessId}`;
            this._http.get(url)
                .catch((err) => {
                    bootbox.alert('Error removing account');
                    return Observable.throw(err);
                })
                .finally(() => {
                })
                .map(result => {
                    var reply:any = result.text();
                    // if (reply == 'True') {
                    //     dispatch(this.fetchBusinesses());
                    // } else {
                    //     bootbox.alert('Problem deleting the selected business');
                    // }
                }).subscribe();
            dispatch({type: REMOVE_BUSINESS, businessId})
        }
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
            var businessServerSources:BusinessSourcesModel = new BusinessSourcesModel({});

            var appdb:Map<string,any> = this.appStore.getState().appdb;
            var url = appdb.get('appBaseUrlUser') + '&command=GetCustomers';
            this._http.get(url)
                .map(result => {
                    var xmlData:string = result.text()
                    // xmlData = xmlData.replace(/}\)/, '').replace(/\(\{"result":"/, '');
                    this.parseString(xmlData, {attrkey: '_attr'}, function (err, result) {
                        var businesses = [], businessIds = [];
                        result.Businesses.BusinessInfo.forEach((business)=> {

                            var source = business._attr.domain;
                            var businessId = business._attr.businessId;

                            var bus:BusinessModel = new BusinessModel({
                                businessId: businessId,
                                source: source,
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

                            // collect server sources
                            businessServerSources = businessServerSources.listPush<BusinessSourcesModel>(BusinessSourcesModel, source, businessId);


                            // collect stats
                            business._attr.accountStatus == 2 ? accountStats.activeAccounts++ : accountStats.inactiveAccounts++;
                            business._attr.studioLite == 0 ? accountStats.pros++ : accountStats.lites++;
                            business._attr.accountStatus == 2 ? accountStats.activeAccounts++ : accountStats.inactiveAccounts++;
                            var lastLogin = Number(business._attr.lastLogin);
                            if (lastLogin > accountStats.lastLogin) {
                                accountStats.lastLogin = business._attr.lastLogin;
                            }
                            businessIds.push(business._attr.businessId)
                            businesses.push(bus);
                        });
                        accountStats.totalBusinesses = businesses.length;

                        dispatch(self.receiveBusinessesSources(businessServerSources));
                        dispatch(self.receiveBusinesses(businesses));
                        dispatch(self.receiveBusinessesStats(accountStats));
                        dispatch(self.fetchBusinessUser(businessIds));

                        // example of setting and getting businessId
                        // var businessId = businessModel.getBusinessId();
                        // var newBusinessModel = businessModel.setBusinessId('123')

                        // this is an update of field in instance via setKey
                        // var busUpd:BusinessModel = bus.setKey<BusinessModel>(BusinessModel, 'businessId', business.attr.businessId + Math.random());

                        // insert a new field in instance
                        // busUpd = busUpd.setKey<BusinessModel>(BusinessModel, 'JS', 'Ninja');

                        // override entire instance with new data via setData
                        // var busUpd:BusinessModel = bus.setData<BusinessModel>(BusinessModel, {
                        // businessId: business.attr.businessId + Math.random(),

                    });
                }).subscribe();
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

    public updateBusinessUserAccess(businessId:string, name:any, accessMask:number, privilegeId:number) {
        return (dispatch)=> {
            var appdb:Map<string,any> = this.appStore.getState().appdb;
            var url = appdb.get('appBaseUrlUser') + `&command=UpdateUserPrivilege&privilegeId=${privilegeId}&accessMask=${accessMask}&customerUserName=${name}`;
            this._http.get(url)
                .map(result => {
                    var xmlData:string = result.text()
                    // xmlData = xmlData.replace(/}\)/, '').replace(/\(\{"result":"/, '');
                    dispatch(this.savedBusinessUserAccess({
                        businessId: businessId,
                        privilegeId: privilegeId,
                        accessMask: accessMask,
                        name: name
                    }))
                }).subscribe();
        }
    }

    // import existing account from MediaSignage
    public associateUser(user:string, pass:string) {
        return (dispatch)=> {
            var appdb:Map<string,any> = this.appStore.getState().appdb;
            var url;
            url = appdb.get('appBaseUrlUser') + `&command=AssociateAccount&customerUserName=${user}&customerPassword=${pass}`;
            this._http.get(url)
                .catch((err) => {
                    bootbox.alert('Error when updating App mode');
                    // return Observable.of(true);
                    return Observable.throw(err);
                })
                .finally(() => {
                })
                .map(result => {
                    var reply:any = result.text();
                    if (reply == 'True') {
                        bootbox.alert('User imported successfully');
                        dispatch(this.fetchBusinesses());
                    } else {
                        bootbox.alert('User could not be imported, either the credentials supplied were wrong or the user is already associated with another enterprise account');
                    }
                }).subscribe();
        }
    }

    // new account from sample or 999 for blank
    public duplicateAccount(businessUser:BusinessUser) {
        let businessId = businessUser.getBusinessId();
        let name = businessUser.getName();
        let businessName = businessUser.businessName();
        let password = businessUser.getPassword();
        let accessMask = businessUser.getAccessMask();
        let privilegeId = businessUser.privilegeId();
        return (dispatch)=> {
            var appdb:Map<string,any> = this.appStore.getState().appdb;
            var url;
            url = appdb.get('appBaseUrlUser') + `&command=DuplicateAccount&customerBusinessName=${businessName}&customerUserName=${name}&customerPassword=${password}&templateBusinessId=${businessId}&privilegeId=${privilegeId}&accessMask=${accessMask}`;
            this._http.get(url)
                .catch((err) => {
                    bootbox.alert('Error creating a new account from samples');
                    // return Observable.of(true);
                    return Observable.throw(err);
                })
                .finally(() => {
                })
                .map(result => {
                    var reply:any = result.text();
                    if (reply == 'True') {
                        dispatch(this.fetchBusinesses());
                    } else {
                        bootbox.alert('User could not be imported, either the credentials supplied were wrong or the user is already associated with another enterprise account');
                    }
                }).subscribe();
        }
    }

    // new user under an account
    public addNewBusinessUser(businessUser:BusinessUser) {
        return (dispatch)=> {
            var appdb:Map<string,any> = this.appStore.getState().appdb;
            let businessId = businessUser.getBusinessId();
            let name = businessUser.getName();
            let password = businessUser.getPassword();
            let accessMask = businessUser.getAccessMask();
            let privilegeId = businessUser.privilegeId();
            var url = appdb.get('appBaseUrlUser') + `&command=AddBusinessUser&businessId=${businessId}&newUserName=${name}&newUserPassword=${password}&privilegeId=${privilegeId}&accessMask=${accessMask}`
            this._http.get(url)
                .map(result => {
                    var jData:string = result.text()
                    if (jData.indexOf('true') > -1) {
                        dispatch({type: ADD_BUSINESS_USER, BusinessUser: businessUser})
                    } else {
                        bootbox.alert('Problem adding user, this user name may be already taken');
                    }
                }).subscribe();
        }
    }

    public updateBusinessPassword(userName:string, newPassword:string) {
        return (dispatch)=> {
            var appdb:Map<string,any> = this.appStore.getState().appdb;
            var url = appdb.get('appBaseUrlUser') + `&command=ChangePassword&userName=${userName}&newPassword=${newPassword}`;
            this._http.get(url)
                .map(result => {
                    var jData:string = result.text()
                    // jData = jData.replace(/}\)/, '').replace(/\(\{"result":"/, '');
                    if (jData.indexOf('true') == -1) {
                        bootbox.alert('Problem changing password');
                    }
                    // dispatch(this.savedBusinessUserAccess({
                    //     businessId: businessId,
                    //     privilegeId: privilegeId,
                    //     accessMask: accessMask,
                    //     name: name
                    // }))
                }).subscribe();
        }
    }

    public removeBusinessUser(businessUser:BusinessUser) {
        return (dispatch)=> {
            var appdb:Map<string,any> = this.appStore.getState().appdb;
            var url = appdb.get('appBaseUrlUser') + `&command=RemoveBusinessUser&customerUserName=${businessUser.getName()}`
            this._http.get(url)
                .map(result => {
                    var jData:string = result.text()
                    // jData = jData.replace(/}\)/, '').replace(/\(\{"result":"/, '');
                    if (jData.indexOf('true') > -1) {
                        dispatch({type: REMOVE_BUSINESS_USER, BusinessUser: businessUser})
                    } else {
                        bootbox.alert('Problem removing user');
                    }
                }).subscribe();
        }
    }

    private savedBusinessUserAccess(i_payload) {
        return {
            type: SET_BUSINESS_USER_ACCESS,
            payload: i_payload
        };
    }

    public saveAccountInfo(payload) {
        return {
            type: SET_BUSINESS_ACCOUNT_DATA,
            payload: payload
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

    public receiveBusinessesSources(businessSources) {
        return {
            type: RECEIVE_BUSINESSES_SOURCES,
            businessSources
        }
    }

    public receiveBusinessUsers(businessUsers:List<BusinessUser>) {
        return {
            type: RECEIVE_BUSINESS_USER,
            businessUsers
        }
    }

    public receiveBusinessSamples(sampleModels:List<SampleModel>) {
        return {
            type: RECEIVE_BUSINESS_SAMPLES,
            sampleModels
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
