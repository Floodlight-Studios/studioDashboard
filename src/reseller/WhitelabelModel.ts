import {StoreModel} from "../models/StoreModel";
import List = Immutable.List;
export class WhitelabelModel extends StoreModel {

    constructor(data:any = {}) {
        super(data);
    }

    public getName() {
        return this.getKey('name');
    }
}