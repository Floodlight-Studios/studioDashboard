import {Http, Jsonp} from "angular2/http";
import {Injectable} from "angular2/core";
import {Actions} from "angular2-redux-util";
import 'rxjs/add/operator/map';
import {BusinessModel} from "./BusinesModel";
import {Lib} from "../../../Lib";

export const REQUEST_BUSINESSES = 'REQUEST_BUSINESSES';
export const RECEIVE_BUSINESSES = 'RECEIVE_BUSINESSES';
export const REQUEST_FILM = 'REQUEST_FILM';
export const RECEIVE_FILM = 'RECEIVE_FILM';
export const CURRENT_FILMS = 'CURRENT_FILMS';
export const RECEIVE_NUMBER_OF_FILMS = 'RECEIVE_NUMBER_OF_FILMS';
export const SET_BUSINESS_DATA = 'SET_BUSINESS_DATA';


//const BASE_URL = "https://galaxy.signage.me/WebService/ResellerService.ashx?command=GetBusinessUsers&resellerUserName=rs@ms.com&resellerPassword=rrr&businessList=385360&callback=JSONP_CALLBACK";
//const BASE_URL = "https://galaxy.signage.me/WebService/ResellerService.ashx?command=GetBusinessUsers&resellerUserName=rs@ms.com&resellerPassword=rrr&businessList=385360&callback=?";
//const BASE_URL = "https://galaxy.signage.me/WebService/ResellerService.ashx?command=GetCustomers&resellerUserName=rs@ms.com&resellerPassword=rrr";
const BASE_URL = "https://secure.digitalsignage.com/proxyRequest/aHR0cHM6Ly9nYWxheHkuc2lnbmFnZS5tZS9XZWJTZXJ2aWNlL1Jlc2VsbGVyU2VydmljZS5hc2h4P2NvbW1hbmQ9R2V0Q3VzdG9tZXJzJnJlc2VsbGVyVXNlck5hbWU9cnNAbXMuY29tJnJlc2VsbGVyUGFzc3dvcmQ9cnJy";

@Injectable()
export class BusinessAction extends Actions {

    constructor(private _http:Http, private jsonp:Jsonp) {
        super();
    }

    /**
     * Redux middleware action for getting server businesses
     * **/
    fetchBusinesses(...args) {
        var self = this;
        return (dispatch) => {

            dispatch(this.requestBusinesses());
            //return this.jsonp
            //    .request(BASE_URL)
            //    .map(res=> {
            //        console.log(res)
            //    }).subscribe();
            //return this.jsonp
            //    .get(BASE_URL)
            //    .map(res=>{
            //        console.log(res);
            //    }).subscribe();
            // https://angular.io/docs/js/latest/api/http/JSONP_PROVIDERS-let.html

            this._http.get(`${BASE_URL}`)
                .map(result => {
                    result = result['_body'].replace(/}\)/, '').replace(/\(\{"result":"/, '');

                    //var parseString = require('xml2js/lib/xml2js.js');
                    //var parseString = require('xml2js').parseString;
                    var result2:any = Lib.Xml2Json().parseString(result);
                    var arr = [], c = 0;

                    result2.Businesses[0].BusinessInfo.forEach((business)=> {
                        c++;
                        if (c>6)
                            return;
                        // create new
                        var bus:BusinessModel = new BusinessModel({
                            businessId: business._attr.businessId._value,
                            name: business._attr.name._value,
                            accountStatus: business._attr.accountStatus._value,
                            applicationId: business._attr.applicationId._value,
                            archiveState: business._attr.archiveState._value,
                            fromTemplateId: business._attr.fromTemplateId._value,
                            maxMonitors: business._attr.maxMonitors._value,
                            maxDataStorage: business._attr.maxDataStorage._value,
                            allowSharing: business._attr.allowSharing._value,
                            studioLite: business._attr.studioLite._value,
                            lastLogin: business._attr.lastLogin._value,
                            resellerId: business._attr.resellerId._value,
                            businessDescription: business._attr.businessDescription._value
                        });

                        // update a field in instance via setKey
                        var busUpd:BusinessModel = bus.setKey<BusinessModel>(BusinessModel, 'businessId', business._attr.businessId._value + Math.random());

                        // insert a new field in instance
                        busUpd = busUpd.setKey<BusinessModel>(BusinessModel, 'JS', 'Ninja');

                        // override entire instance with new data via setData
                        //var busUpd:BusinessModel = bus.setData<BusinessModel>(BusinessModel, {
                        //    businessId: business.attr.businessId + Math.random(),
                        //});
                        arr.push(busUpd);

                    });
                    dispatch(self.receiveBusinesses(arr));

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

    fetchBusiness(index) {
        return (dispatch) => {
            dispatch(this.requestFilm());
            this._http.get(`${BASE_URL}${index + 1}/`)
                .map(result => result.json())
                .map(json => {
                    dispatch(this.receiveFilm(json));
                })
                .subscribe();
        };
    }

    requestBusinesses() {
        return {type: REQUEST_BUSINESSES};
    }

    receiveBusinesses(businesses) {
        return {
            type: RECEIVE_BUSINESSES,
            businesses
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
