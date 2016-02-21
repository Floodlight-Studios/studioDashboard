import {List} from 'immutable';
import {Map} from 'immutable';
import * as BusinessAction from './BusinessAction';
import businessesReducer from '../business/BusinessesReducer';
import {BusinessModel} from "./BusinesModel";

export interface IBusinessAction {
    type: string;
    businesses: BusinessModel[];
    businessId?: string,
    key?: string,
    value: any

}

export function business(state:Map<string,any> = Map<string,any>(), action:any):Map<string,any> {

    // function indexOf(businessId:string) {
    //     return state.findIndex((i:BusinessModel) => i.getKey('businessId') === businessId);
    // }

    switch (action.type) {
        case BusinessAction.REQUEST_BUSINESSES:
            return state;

        case BusinessAction.RECEIVE_BUSINESSES:
            state = state.setIn(['businessStats'], {
                totalBusiness: action.businesses.length,
                totalBusiness2: action.businesses.length
            });
            var businesses:List<BusinessModel> = state.getIn(['businesses'])
            var list:List<BusinessModel> = businessesReducer(businesses, action);
            return state.setIn(['businesses'], list);

        case BusinessAction.SET_BUSINESS_DATA:
            var businesses:List<BusinessModel> = state.getIn(['businesses'])
            var list:List<BusinessModel> = businessesReducer(businesses, action);
            return state.setIn(['businesses'], list);

        //return businesses; //return Object.assign({}, state, action.businesses);
        //return state.push(action.businesses);
        //case 'REMOVE':
        //    return List<BusinessModel>(state.filter((i: BusinessModel) => i.uuid !== action.itemId));
        //case 'UPDATE_ITEM_TEXT':
        //    return state.update(indexOf(action.itemId), (i: BusinessModel) => i.setText(action.text));
        //case 'UPDATE_ITEM_COMPLETION':
        //    return state.update(indexOf(action.itemId), (i: BusinessModel) => i.setCompleted(action.completed));
        default:
            return state;
    }
}