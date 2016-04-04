import {List} from 'immutable';
import {Map} from 'immutable';
import * as StationsAction from "./StationsAction";
import {StationModel} from "./StationModel";
const _ = require('underscore');

export function stations(state:Map<string,any> = Map<string,any>(), action:any):Map<string,any> {
    switch (action.type) {
        case StationsAction.RECEIVE_STATIONS:
            return state.update(action.source, (value) => action.stations);
        default:
            return state;
    }
}