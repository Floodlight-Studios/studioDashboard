import {List} from 'immutable';
import {Map} from 'immutable';
import * as StationsAction from "./StationsAction";
import {StationModel} from "./StationModel";
const _ = require('underscore');

export function stations(state:Map<string,any> = Map<string,any>(), action:any):Map<string, List<StationModel>> {
    switch (action.type) {
        case StationsAction.RECEIVE_STATIONS:
            // if (_.isNull(action.stations))
            //     return state;
            return state.update(action.source, (value) => action.stations);

        case StationsAction.RECEIVE_STATIONS_GEO:

            for (var i in action.payload) {
                var station = action.payload[i];
                var stations:List<StationModel> = state.get(station.source);
                stations.forEach((i_station:StationModel, counter)=> {
                    if (i_station.getKey('businessId') == station.businessId && station.id == i_station.getKey('id')) {
                        console.log(station);
                        var updStation = i_station.setKey<StationModel>(StationModel, 'location', {
                            lat: station.lat,
                            lon: station.lat
                        })
                        // i_privelegesModel.getColumns().forEach((group, c) => {
                        //     if (group.get('tableName') == action.payload.tableName) {
                        //         var key = Lib.MapOfIndex(group.get('columns'), action.payload.index, 'first');
                        //         var path = ['groups', c, 'columns', key];
                        //         var data = i_privelegesModel.getData().updateIn(path, v => action.payload.updTotalBits)
                        //         var updPriv = i_privelegesModel.setData<PrivelegesModel>(PrivelegesModel, data);
                        //         privileges = privileges.set(counter, updPriv);
                        //     }
                        // })
                    }
                })
            }


            // return state.setIn(['privileges'], privileges);

            
            return state;
            // return state.update(action.source, (value) => action.stations);
        default:
            return state;
    }
}