import {List} from 'immutable';
import {Map} from 'immutable';
import * as StationsAction from "./StationsAction";
import {StationModel} from "./StationModel";
const _ = require('underscore');

export function stations(state:Map<string,any> = Map<string,any>(), action:any):Map<string, List<StationModel>> {

    function indexOfStation(businessId, stationId):any {
        return stations.findIndex((i:StationModel) => {
            return i.getKey('businessId') === businessId && i.getKey('id') == stationId;
        });
    }

    switch (action.type) {
        case StationsAction.RECEIVE_STATIONS:
            return state.update(action.source, (value) => action.stations);

        case StationsAction.RECEIVE_STATIONS_GEO:
            for (var i in action.payload) {
                var station = action.payload[i];
                var source = station.source;
                var stations:List<StationModel> = state.get(source);
                stations = stations.update(indexOfStation(station.businessId, station.id), (i_station:StationModel) => {
                    return i_station.setKey<StationModel>(StationModel, 'geoLocation', {
                        lat: station.lat,
                        lon: station.lon
                    })
                });
                state = state.setIn([source], stations);
            }
            return state;
        default:
            return state;
    }
}
