import {StoreModel} from "../models/StoreModel";
import List = Immutable.List;
export class WhitelabelModel extends StoreModel {

    constructor(data:any = {}) {
        super(data);
    }

    public getEnabled() {
        return this.getKey('whitelabelEnabled');
    } 
}