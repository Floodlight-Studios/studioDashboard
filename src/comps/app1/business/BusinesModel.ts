import {StoreModel} from "../../../models/StoreModel";

/**
 * Thin wrapper of Immutable data around a single business
 * **/
export class BusinessModel extends StoreModel {

    constructor(data:any = {}) {
        super(data);
    }

    invalidateBusinessId(i_businessId = -1) {
        return this.setKey<BusinessModel>(BusinessModel, 'businessId', i_businessId);
    }

}