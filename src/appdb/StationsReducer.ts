import {Map} from 'immutable';
import * as StationsAction from "../appdb/StationsAction";

/** global application reduced actions defined here **/

export default function stations(state:Map<string, any> = Map<string, any>({}), action:any):Map<string, any> {
    switch (action.type) {
        case StationsAction.APP_START_TIME:
            return state.merge({credentials: {authenticated: action.authenticated, user: action.user, pass: action.pass}});
        case StationsAction.APP_START_TIME:
            return state.merge({appStartTime: Date.now()});
        default:
            return state;
    }
}