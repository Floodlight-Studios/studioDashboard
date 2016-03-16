import {StoreModel} from "../models/StoreModel";
export class PrivelegesSystemModel extends StoreModel {

    constructor(data:any = {}) {
        super(data);
    }

    public getPrivelegesId(){
        return this.getKey('privilegesId');
    }
}