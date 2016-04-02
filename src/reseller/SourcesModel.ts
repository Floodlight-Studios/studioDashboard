import {StoreModel} from "../models/StoreModel";
export class SourcesModel extends StoreModel {

    constructor(data:any = {}) {
        super(data);
    }

    public getSourceId() {
        return this.getKey('id');
    }

    public getServerName() {
        return this.getKey('serverName');
    }

    public getBusinessDomain() {
        return this.getKey('businessDomain');
    }
}