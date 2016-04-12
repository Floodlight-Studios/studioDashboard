import {Map} from 'immutable';

import * as AppdbAction from "../appdb/AppdbAction";
const Immutable = require('immutable');
const baseUrl = 'https://galaxy.signage.me/WebService/ResellerService.ashx';

export default function appdb(state:Map<string, any> = Map<string, any>({}), action:any):Map<string, any> {
    switch (action.type) {
        case AppdbAction.AUTH_FAIL:
        case AppdbAction.AUTH_PASS:
            return state.merge({
                credentials: {
                    authenticated: action.authenticated,
                    user: action.user,
                    pass: action.pass,
                    remember: action.remember,
                    reason: action.reason
                },
                appBaseUrlUser: `${baseUrl}?resellerUserName=${action.user}&resellerPassword=${action.pass}`
            });
        case AppdbAction.APP_INIT:
            return state.merge({
                appStartTime: Date.now(),
                appBaseUrl: `${baseUrl}`
            });
        case AppdbAction.CLOUD_SERVERS:
            return state.merge({
                cloudServers: action.payload
            });
        case AppdbAction.SERVERS_STATUS:
            return state.merge({serversStatus: action.payload});
        default:
            return state;
    }
}


