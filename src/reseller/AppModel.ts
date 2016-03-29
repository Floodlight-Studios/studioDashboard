import {StoreModel} from "../models/StoreModel";
import List = Immutable.List;
export class AppModel extends StoreModel {

    constructor(data:any = {}) {
        super(data);
    }

    public getAppId() {
        return this.getKey('name');
    }

    public getColumns() {
        return this.getKey('groups');
    }

    public getPrivelegesId() {
        return this.getKey('privilegesId');
    }
}