import {List} from 'immutable';
import {Map} from 'immutable';
import * as BusinessAction from './BusinessAction';
import businessesReducer from '../business/BusinessesReducer';
import {BusinessModel} from "./BusinessModel";
import {BusinessUser} from "./BusinessUser";

export function business(state:Map<string,any> = Map<string,any>(), action:any):Map<string,any> {

    function indexOfName(businessId, name):any {
        return businessUsers.findIndex((i:BusinessUser) => {
            return i.getBusinessId() === businessId && i.getKey('name') == name;
        });
    }

    switch (action.type) {
        case BusinessAction.REQUEST_BUSINESSES:
            return state;

        case BusinessAction.RECEIVE_BUSINESSES:
            var businesses:List<BusinessModel> = state.getIn(['businesses'])
            var list:List<BusinessModel> = businessesReducer(businesses, action);
            return state.setIn(['businesses'], list);

        case BusinessAction.RECEIVE_BUSINESS_USER:
            return state.setIn(['businessUsers'], action.businessUsers);

        case BusinessAction.RECEIVE_BUSINESSES_SOURCES:
            return state.setIn(['businessSources'], action.businessSources);
        
        case BusinessAction.RECEIVE_BUSINESSES_STATS:
            return state.setIn(['businessStats'], action.stats);

        case BusinessAction.SET_BUSINESS_DATA:
            var businesses:List<BusinessModel> = state.getIn(['businesses'])
            var list:List<BusinessModel> = businessesReducer(businesses, action);
            return state.setIn(['businesses'], list);

        case BusinessAction.CHANGE_BUSINESS_USER_NAME:
        {
            var businessUsers:List<BusinessUser> = state.getIn(['businessUsers'])
            // new name is already taken or user ended up not modifying original name, ignore
            if (indexOfName(action.businessId, action.value.newValue) != -1)
                return state;
            businessUsers = businessUsers.update(indexOfName(action.businessId, action.value.oldValue), (business:BusinessUser) => {
                return business.setKey<BusinessUser>(BusinessUser, action.key, action.value.newValue)
            });
            return state.setIn(['businessUsers'], businessUsers);
        }

        case BusinessAction.SET_BUSINESS_USER_ACCESS:
        {
            var businessUsers:List<BusinessUser> = state.getIn(['businessUsers'])
            businessUsers = businessUsers.update(indexOfName(action.payload.businessId, action.payload.name), (business:BusinessUser) => {
                let businessUser:BusinessUser = business.setKey<BusinessUser>(BusinessUser, 'accessMask', action.payload.accessMask)
                return businessUser.setKey<BusinessUser>(BusinessUser, 'privilegeId', action.payload.privilegeId)
            });
            return state.setIn(['businessUsers'], businessUsers);
        }

        case BusinessAction.ADD_BUSINESS_USER:
        {
            var businessUsers:List<BusinessUser> = state.getIn(['businessUsers'])
            businessUsers = businessUsers.push(action.BusinessUser);
            return state.setIn(['businessUsers'], businessUsers);
        }

        case BusinessAction.REMOVE_BUSINESS:
        {
            var businesses:List<BusinessModel> = state.getIn(['businesses'])
            var updatedBusinesses:List<BusinessModel> = businesses.filter((businessModel: BusinessModel) => businessModel.getBusinessId() !== action.businessId) as List<BusinessModel>;
            return state.setIn(['businesses'], updatedBusinesses);
        }

        case BusinessAction.REMOVE_BUSINESS_USER:
        {
            var businessUsers:List<BusinessUser> = state.getIn(['businessUsers'])
            var updatedBusinessUsers:List<BusinessUser> = businessUsers.filter((businessUser: BusinessUser) => businessUser.getName() !== action.BusinessUser.getName()) as List<BusinessUser>;
            return state.setIn(['businessUsers'], updatedBusinessUsers);
        }

        default:
            return state;
    }
}