import {StoreModel} from "../models/StoreModel";
import List = Immutable.List;
export class PrivelegesModel extends StoreModel {

    constructor(data:any = {}) {
        super(data);
    }

    public getName() {
        return this.getKey('name');
    }

    public getColumns() {
        return this.getKey('groups');
    }

    public getPrivelegesId() {
        return this.getKey('privilegesId');
    }
}