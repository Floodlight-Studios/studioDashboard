import {StoreModel} from "../models/StoreModel";

/**
 * Thin wrapper of Immutable data around a single business
 * **/
export class BusinessModel extends StoreModel {

    constructor(data:any = {}) {
        super(data);
    }

    // a wrapper around base class public setKey<T>(ClassName:any, key:string, value:any):T {...
    // so we don't have to pass in the generic every time
    public setModelKey(key:string, value:any):BusinessModel {
        return this.setData(BusinessModel, this._data.set(key, value)) as BusinessModel;
    }

    public setBusinessId(id:string){
        return this.setKey<BusinessModel>(BusinessModel, 'businessId', id);
    }

    public getBusinessId(){
        return this.getKey('businessId');
    }

    invalidateBusinessId(i_businessId = -1) {
        return this.setKey<BusinessModel>(BusinessModel, 'businessId', i_businessId);
    }

}