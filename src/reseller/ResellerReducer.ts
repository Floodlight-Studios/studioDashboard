import {List} from 'immutable';
import {Map} from 'immutable';
import * as ResellerAction from './ResellerAction';
import {PrivelegesModel} from "./PrivelegesModel";

export function reseller(state:Map<string,any> = Map<string,any>(), action:any):Map<string,any> {

    switch (action.type) {

        case ResellerAction.RECEIVE_PRIVILEGES:
        {
            return state.setIn(['privileges'], action.privilegesModels);
        }
        case ResellerAction.RECEIVE_PRIVILEGES_SYSTEM:
        {
            return state.setIn(['privilegesSystem'], action.privelegesSystemModels);
        }
        case ResellerAction.UPDATE_PRIVILEGES:
        {
            console.log(action);
            console.log(action);
           // return state.setIn(['privileges'], action.privelegesSystemModels);
        }
        default:
            return state;
    }
}