import {StoreModel} from "../models/StoreModel";
export class PrivelegesModel extends StoreModel {

    constructor(data:any = {}) {
        super(data);
    }

    public getName(){
        return this.getKey('name');
    }

    public getColumns(){
        console.log(this)
        return this.getData().get('groups');
    }

    public getPrivelegesId(){
        return this.getKey('privilegesId');
    }
}