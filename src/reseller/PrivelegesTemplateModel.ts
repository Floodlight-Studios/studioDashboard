import {StoreModel} from "../models/StoreModel";
export class PrivelegesTemplateModel extends StoreModel {

    constructor(data:any = {}) {
        super(data);
    }

    public getPrivelegesId() {
        return this.getKey('privilegesId');
    }

    public getTableName():string {
        return this.getKey('tableName');
    }

    public getGroupAttributes():Array<any> {
        var result = [];
        var keys = this.getData().toJS();
        for (var key in keys) {
            if (key == 'name' || key == 'columns' || key == 'tableName')
                continue;
            result.push(key);
        }
        return result;
    }

    public getColumns() {
        return this.getKey('columns');
    }

    public getColumnSize():number {
        try {
            return this.getKey('columns').size
        } catch (e) {
            return 0;
        }

    }
}