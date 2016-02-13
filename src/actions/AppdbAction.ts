import {Injectable} from "angular2/core";
import {Actions} from "angular2-redux-util";

export const APP_START_TIME = 'APP_START_TIME';
export const AUTH_PASS = 'AUTH_PASS';
export const AUTH_FAIL = 'AUTH_FAIL';

/** global application actions defined here **/

@Injectable()
export class AppdbAction extends Actions {

    public appStartTime() {
        return {type: APP_START_TIME, value: Date.now()};
    }

    public authenticateUser(i_user, i_pass) {
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
