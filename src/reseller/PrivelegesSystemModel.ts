import {StoreModel} from "../models/StoreModel";
export class PrivelegesSystemModel extends StoreModel {

    constructor(data:any = {}) {
        super(data);
    }

    public getPrivelegesId() {
        return this.getKey('privilegesId');
    }

    public getTableName() {
        return this.getKey('tableName');
    }

    public getColumns() {
        return this.getKey('columns');
    }

    public getColumnSize():number {
        try {
            return this.getKey('columns').size
        } catch(e) {
            return 0;
        }

    }
}