import {StoreModel} from "../models/StoreModel";

/**
 * Thin wrapper of Immutable data around a single business
 * **/
export class SampleModel extends StoreModel {

    constructor(data:any = {}) {
        super(data);
    }

    public getName():string {
        return this.getKey('name')
    }

    public getType():string {
        return this.getKey('type')
    }

}