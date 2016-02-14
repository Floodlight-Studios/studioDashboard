import {Map} from 'immutable';
import * as AppdbAction from "../actions/AppdbAction";

/** global application reduced actions defined here **/

export default function appdb(state:Map<string, any> = Map<string, any>({}), action:any):Map<string, any> {
    switch (action.type) {
        case AppdbAction.AUTH_PASS:
            return state.merge({credentials: {authenticated: action.authenticated, user: action.user, pass: action.pass}});
        case AppdbAction.APP_START_TIME:
            return state.merge({appStartTime: Date.now()});
        default:
            return state;
    }
}