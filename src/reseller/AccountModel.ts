import {StoreModel} from "../models/StoreModel";
import List = Immutable.List;
export class AccountModel extends StoreModel {

    constructor(data:any = {}) {
        super(data);
    }

    public getType():string {
        return this.getKey('type');
    }

}