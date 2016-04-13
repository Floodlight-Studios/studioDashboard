import {List} from 'immutable';
import {Map} from 'immutable';
import * as ResellerAction from './ResellerAction';
import {PrivelegesModel} from "./PrivelegesModel";
import {Lib} from "../Lib";
import {AppModel} from "./AppModel";
import {WhitelabelModel} from "./WhitelabelModel";
const _ = require('underscore');

export function reseller(state:Map<string,any> = Map<string,any>(), action:any):Map<string,any> {

    switch (action.type) {
        case ResellerAction.RECEIVE_APPS:
        {
            return state.setIn(['apps'], action.apps);
        }
        case ResellerAction.UPDATE_ACCOUNT:
        {
            console.log(action);
            return state;//.setIn(['apps'], action.apps);
        }
        case ResellerAction.UPDATE_APP:
        {
            var appModels:List<AppModel> = state.getIn(['apps']);
            var index = appModels.findIndex((i:AppModel) => i.getAppId() === action.app.getAppId());
            appModels = appModels.update(index, (appModel:AppModel) => {
                return appModel.setKey<AppModel>(AppModel, 'installed', action.mode)
            });
            return state.setIn(['apps'], appModels);
        }
        case ResellerAction.RECEIVE_WHITELABEL:
        {
            return state.setIn(['whitelabel'], action.whitelabelModel);
        }
        case ResellerAction.RECEIVE_ACCOUNT_INFO:
        {
            return state.setIn(['accounts'], action.accountModels);
        }
        case ResellerAction.UPDATE_DEFAULT_PRIVILEGE:
        {
            return state.setIn(['privilegeDefault'], action.privilegeId);
        }
        case ResellerAction.RECEIVE_DEFAULT_PRIVILEGE:
        {
            return state.setIn(['privilegeDefault'], action.privilegeId);
        }
        case ResellerAction.RECEIVE_PRIVILEGES:
        {
            return state.setIn(['privileges'], action.privilegesModels);
        }
        case ResellerAction.RECEIVE_PRIVILEGES_SYSTEM:
        {
            return state.setIn(['privilegesSystem'], action.privelegesSystemModels);
        }
        // case ResellerAction.RECEIVE_SERVER_SOURCES:
        // {
        //     return state.setIn(['serverSources'], action.sourceModels);
        // }
        case ResellerAction.UPDATE_PRIVILEGE_NAME:
        {
            var privileges = state.get('privileges');
            privileges.forEach((i_privelegesModel:PrivelegesModel, counter)=> {
                if (i_privelegesModel.getPrivelegesId() == action.privilegeId) {
                    var updPriv = i_privelegesModel.setKey(PrivelegesModel, 'name', action.privilegeName)
                    privileges = privileges.set(counter, updPriv);
                }
            })
            return state.setIn(['privileges'], privileges);
        }
        case ResellerAction.ADD_PRIVILEGE:
        {
            var privileges = state.get('privileges');
            var updatedPrivelegesModels:List<PrivelegesModel> = privileges.push(action.privelegesModel);
            return state.setIn(['privileges'], updatedPrivelegesModels);
        }
        case ResellerAction.REMOVE_PRIVILEGE:
        {
            var privileges = state.get('privileges');
            var updatedPrivelegesModels:List<PrivelegesModel> = privileges.filter((privelegesModel:PrivelegesModel) => privelegesModel.getPrivelegesId() !== action.privilegeId) as List<PrivelegesModel>;
            return state.setIn(['privileges'], updatedPrivelegesModels);
        }
        case ResellerAction.UPDATE_PRIVILEGES:
        {
            var privileges = state.get('privileges');
            privileges.forEach((i_privelegesModel:PrivelegesModel, counter)=> {
                if (i_privelegesModel.getName() == action.payload.selPrivName) {
                    i_privelegesModel.getColumns().forEach((group, c) => {
                        if (group.get('tableName') == action.payload.tableName) {
                            var key = Lib.MapOfIndex(group.get('columns'), action.payload.index, 'first');
                            var path = ['groups', c, 'columns', key];
                            var data = i_privelegesModel.getData().updateIn(path, v => action.payload.updTotalBits)
                            var updPriv = i_privelegesModel.setData<PrivelegesModel>(PrivelegesModel, data);
                            privileges = privileges.set(counter, updPriv);
                        }
                    })
                }
            })
            return state.setIn(['privileges'], privileges);
        }
        case ResellerAction.UPDATE_WHITELABEL:
        {
            var whitelabel:WhitelabelModel = state.get('whitelabel');
            _.forEach(action.payload, (value, key)=> {
                if (value === false)
                    value = 0;
                if (value === true)
                    value = 1;
                whitelabel = whitelabel.setKey<WhitelabelModel>(WhitelabelModel, key, value);
            })
            return state.setIn(['whitelabel'], whitelabel);
        }
        default:
            return state;
    }
}