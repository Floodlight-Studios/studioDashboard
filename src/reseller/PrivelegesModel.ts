import {StoreModel} from "../models/StoreModel";
export class PrivelegesModel extends StoreModel {

    constructor(data:any = {}) {
        super(data);
    }

    public getName(){
        return this.getKey('name');
    }

    public getPrivelegesId(){
        return this.getKey('privilegesId');
    }
}