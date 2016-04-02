import {List} from 'immutable';
import {Map} from 'immutable';
const _ = require('underscore');

export function stations(state:Map<string,any> = Map<string,any>(), action:any):Map<string,any> {

    switch (action.type) {
        case 'XXXXX':
        {
            return state.setIn(['apps'], action.apps);
        }
        default:
            return state;
    }
}