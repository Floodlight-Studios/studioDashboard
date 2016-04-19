import {List} from 'immutable';
import {Map} from 'immutable';
import * as ResellerAction from './ResellerAction';
import {PrivelegesModel} from "./PrivelegesModel";
import {Lib} from "../Lib";
import {AppModel} from "./AppModel";
import {WhitelabelModel} from "./WhitelabelModel";
import {AccountModel} from "./AccountModel";
const _ = require('underscore');

export function reseller(state:Map<string,any> = Map<string,any>(), action:any):Map<string,any> {

    switch (action.type) {
        case ResellerAction.RECEIVE_APPS:
        {
            return state.setIn(['apps'], action.apps);
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
        case ResellerAction.UPDATE_PRIVILEGE_ATTRIBUTE:
        {
            var privileges = state.get('privileges');
            privileges.forEach((i_privelegesModel:PrivelegesModel, counter)=> {
                if (i_privelegesModel.getName() == action.payload.selPrivName) {
                    i_privelegesModel.getColumns().forEach((group, c) => {
                        if (group.get('tableName') == action.payload.tableName) {
                            var value = Lib.BooleanToNumber(action.payload.value);
                            var path = ['groups', c, action.payload.privelegesAttribute];
                            var data = i_privelegesModel.getData().updateIn(path, v => value)
                            var updPriv = i_privelegesModel.setData<PrivelegesModel>(PrivelegesModel, data);
                            privileges = privileges.set(counter, updPriv);
                        }
                    })
                }
            })
            return state.setIn(['privileges'], privileges);
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
        case ResellerAction.UPDATE_ACCOUNT:
        {
            _.forEach(action.payload, (v, k)=> {
                var type = k.split('_')[0]
                var key = k.split('_')[1]
                var value = v;
                var accountModels:List<AccountModel> = state.getIn(['accounts']);
                var index = accountModels.findIndex((i:AccountModel) => i.getType().toLowerCase() === type.toLowerCase());
                if (index == -1)
                    return state;
                accountModels = accountModels.update(index, (accountModel:AccountModel) => {
                    return accountModel.setKey<AccountModel>(AccountModel, key, value);
                });
                state = state.setIn(['accounts'], accountModels);
            });
            return state;
        }
        case ResellerAction.UPDATE_WHITELABEL:
        {
            var whitelabel:WhitelabelModel = state.get('whitelabel');
            _.forEach(action.payload, (value, key)=> {
                value = Lib.BooleanToNumber(value);
                whitelabel = whitelabel.setKey<WhitelabelModel>(WhitelabelModel, key, value);
            })
            return state.setIn(['whitelabel'], whitelabel);
        }
        default:
            return state;
    }
}