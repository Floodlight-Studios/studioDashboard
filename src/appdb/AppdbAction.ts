import {Injectable} from "angular2/core";
import {Actions, AppStore} from "angular2-redux-util";
import {Http, Jsonp} from "angular2/http";
import {FlagsAuth} from "../services/AuthService";

export const APP_INIT = 'APP_INIT';
export const SERVERS_STATUS = 'SERVERS_STATUS';
export const AUTH_PASS = 'AUTH_PASS';
export const AUTH_FAIL = 'AUTH_FAIL';

@Injectable()
export class AppdbAction extends Actions {

    constructor(private appStore:AppStore, private _http:Http, private jsonp:Jsonp) {
        super(appStore);
    }

    public authenticateUser(i_user, i_pass, i_remember) {
        return (dispatch) => {

            //todo: change url to load from redux
            const BASE_URL = `https://galaxy.signage.me/WebService/ResellerService.ashx?command=GetCustomers&resellerUserName=${i_user}&resellerPassword=${i_pass}`;

            this._http.get(`${BASE_URL}`)
                .map(result => {
                    var xmlData:string = result.text()
                    xmlData = xmlData.replace(/}\)/, '').replace(/\(\{"result":"/, '');
                    var parseString = require('xml2js').parseString;
                    parseString(xmlData, {attrkey: 'attr'}, function (err, result) {
                        if (!result) {
                            dispatch({
                                type: AUTH_FAIL,
                                authenticated: false,
                                user: i_user,
                                pass: i_pass,
                                remember: i_remember,
                                reason: FlagsAuth.WrongPass
                            });
                        } else if (result && !result.Businesses) {
                            dispatch({
                                type: AUTH_PASS,
                                authenticated: false,
                                user: i_user,
                                pass: i_pass,
                                remember: i_remember,
                                reason: FlagsAuth.NotEnterprise
                            });
                        } else {
                            dispatch({
                                type: AUTH_FAIL,
                                authenticated: true,
                                user: i_user,
                                pass: i_pass,
                                remember: i_remember,
                                reason: FlagsAuth.Enterprise
                            });
                        }
                    });
                }).subscribe()

            // const JBASE_URL = "https://galaxy.signage.me/WebService/ResellerService.ashx?command=GetCustomers&resellerUserName=rs@ms.com&resellerPassword=XXXX&callback=JSONP_CALLBACK";
            //
            // return this.jsonp
            //    .request(JBASE_URL)
            //    .map(res=> {
            //        console.log(res)
            //    }).subscribe();

            // old lib I used
            //var parseString = require('xml2js/lib/xml2js.js');
            //var parseString = require('xml2js').parseString;

            // https://angular.io/docs/js/latest/api/http/JSONP_PROVIDERS-let.html

            // setTimeout(()=> {
            //     dispatch({type: AUTH_PASS, authenticated: true, user: i_user, pass: i_pass});
            // }, 200);


            // self.m_http.get(`https://galaxy.signage.me/WebService/ResellerService.ashx?command=GetBusinessUsers&resellerUserName=${i_user}&resellerPassword=${i_pass}&businessList=385360`)
            //     .map(result => {
            //         result = result['_body'].replace(/}\)/, '').replace(/\(\{"result":"/, '');
            //         var jData:Object = Lib.Xml2Json().parseString(result);
            //
            //     }).subscribe();

        };
    }

    public serverStatus() {
        return (dispatch) => {
            this._http.get(`https://secure.digitalsignage.com/msPingServersGuest`)
                .map(result => {
                    result = result.json();
                    dispatch({type: SERVERS_STATUS, payload: result});
                }).subscribe();
            return;
        };
    }

    public initAppDb() {
        return {type: APP_INIT, value: Date.now()};
    }

    public authenticateUserA(i_user, i_pass) {
        var self = this;
        console.log('Auth user ' + i_user + ' ' + i_pass)
        return (dispatch:Redux.Dispatch)=> {
            setTimeout(()=> {
                dispatch({type: AUTH_PASS, authenticated: true, user: i_user, pass: i_pass});
            }, 2000);
            //dispatch({type: AUTH_USER});
            // fake server call until backend is ready with CORS

            return;
            // disabled for now
            //this._http.get(`${BASE_URL}`)
            //    .map(result => {
            //        dispatch({type: AUTH_PASS, user: i_user, pass: i_pass});
            //    }).subscribe();
        }
    }
}
