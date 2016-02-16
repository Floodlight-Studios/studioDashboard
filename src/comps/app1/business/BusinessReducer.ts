import {List} from 'immutable';
import * as BusinessAction from './BusinessAction';
import {BusinessModel} from "./BusinesModel";

export interface IBusinessAction {
    type: string;
    businesses: BusinessModel[];
    businessId?: string,
    key?: string,
    value: any

}

export function business(state:List<BusinessModel> = List<BusinessModel>(), action:IBusinessAction) {

    function indexOf(businessId:string) {
        return state.findIndex((i:BusinessModel) => i.getKey('businessId') === businessId);
    }

    switch (action.type) {
        case BusinessAction.REQUEST_BUSINESSES:
            return state;
        //return Object.assign({}, state, {isFetchingFilms: true});
        case BusinessAction.RECEIVE_BUSINESSES:
            return List(action.businesses);
        case BusinessAction.SET_BUSINESS_DATA:
            return state.update(indexOf(action.businessId), (business:BusinessModel) => {
                return business.setKey<BusinessModel>(BusinessModel, action.key, action.value)
            });

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