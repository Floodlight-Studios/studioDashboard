import {StoreModel} from "../models/StoreModel";
import List = Immutable.List;
export class WhitelabelModel extends StoreModel {

    constructor(data:any = {}) {
        super(data);
    }

    public getAccountStatus() {
        return this.getKey('accountStatus');
    }
}