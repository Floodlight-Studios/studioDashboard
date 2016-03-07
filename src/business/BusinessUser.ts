import {StoreModel} from "../models/StoreModel";
export class BusinessUser extends StoreModel {
    constructor(data:any = {}) {
        super(data);
    }

    // a wrapper around base class public setKey<T>(ClassName:any, key:string, value:any):T {...
    // so we don't have to pass in the generic every time
    public setModelKey(key:string, value:any):BusinessUser {
        return this.setData(BusinessUser, this._data.set(key, value)) as BusinessUser;
    }

    public setBusinessId(id:string){
        return this.setKey<BusinessUser>(BusinessUser, 'businessId', id);
    }

    public getBusinessId(){
        return this.getKey('businessId');
    }

    public getName(){
        return this.getKey('name');
    }

    public getAccessMask(){
        return this.getKey('accessMask');
    }
}