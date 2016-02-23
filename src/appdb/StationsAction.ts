import {Injectable} from "angular2/core";
import {Actions, AppStore} from "angular2-redux-util";
import {Http} from "angular2/http";

export const APP_START_TIME = 'APP_START_TIME';

@Injectable()
export class StationActions extends Actions {

    constructor(private appStore:AppStore, private m_http:Http){
        super(appStore);
    }

    public authenticateUser(i_user, i_pass) {
        return (dispatch) => {

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

            // setTimeout(()=> {
            //     dispatch({type: AUTH_PASS, authenticated: true, user: i_user, pass: i_pass});
            // }, 200);

            return;

            // self.m_http.get(`https://galaxy.signage.me/WebService/ResellerService.ashx?command=GetBusinessUsers&resellerUserName=${i_user}&resellerPassword=${i_pass}&businessList=385360`)
            //     .map(result => {
            //         result = result['_body'].replace(/}\)/, '').replace(/\(\{"result":"/, '');
            //         var jData:Object = Lib.Xml2Json().parseString(result);
            //
            //     }).subscribe();

        };
    }

    public appStartTime() {
        return {type: APP_START_TIME, value: Date.now()};
    }

    public authenticateUserA(i_user, i_pass) {

        return (dispatch:Redux.Dispatch)=> {
            // setTimeout(()=> {
            //     dispatch({type: AUTH_PASS, authenticated: true, user: i_user, pass: i_pass});
            // }, 2000);

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
