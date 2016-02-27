import {Map} from 'immutable';
import * as AppdbAction from "../appdb/AppdbAction";
var Immutable = require('immutable');

/** global application reduced actions defined here **/

export default function appdb(state:Map<string, any> = Map<string, any>({}), action:any):Map<string, any> {
    switch (action.type) {
        case AppdbAction.AUTH_FAIL:
        case AppdbAction.AUTH_PASS:
            return state.merge({
                credentials: {
                    authenticated: action.authenticated,
                    user: action.user,
                    pass: action.pass
                },
                appBaseUrlUser: `https://galaxy.signage.me/WebService/ResellerService.ashx?resellerUserName=${action.user}&resellerPassword=${action.pass}`
            });
        case AppdbAction.APP_INIT:
            return state.merge({
                appStartTime: Date.now(),
                appBaseUrl: 'https://galaxy.signage.me/WebService/ResellerService.ashx'
            });
        case AppdbAction.SERVERS_STATUS:
            return state.merge({serversStatus: action.payload});
        default:
            return state;
    }
}


