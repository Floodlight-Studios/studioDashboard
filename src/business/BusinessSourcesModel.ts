import {StoreModel} from "../models/StoreModel";
import {Map, List} from 'immutable';

/**
 * Thin wrapper of Immutable data around a single business
 * **/
export class BusinessSourcesModel extends StoreModel {

    constructor(data:any = {}) {
        super(data);
    }

    // a wrapper around base class public setKey<T>(ClassName:any, key:string, value:any):T {...
    // so we don't have to pass in the generic every time
    // public setModelKey(key:string, value:any):BusinessModel {
    //     return this.setData(BusinessModel, this._data.set(key, value)) as BusinessModel;
    // }

    // public getSource(source:string) {
    //     return this.getKey(source);
    // }
    //
    // public getSources() {
    //     return this.getKey('sources');
    // }

    // setSources(source:string, businessId:string) {
    //     return this.listPush(source,businessId)
    //     // var serverSource = this.getKey(source);
    //     // var businessSourcesModel:BusinessSourcesModel = this;
    //     // if (!serverSource)
    //     //     businessSourcesModel = this.setKey<BusinessSourcesModel>(BusinessSourcesModel, source, List<any>());
    //     // var businessList:List<any> = businessSourcesModel.getKey(source);
    //     // businessList = businessList.push(businessId);
    //     // return businessSourcesModel.setKey<BusinessSourcesModel>(BusinessSourcesModel, source, businessList);
    // }



}