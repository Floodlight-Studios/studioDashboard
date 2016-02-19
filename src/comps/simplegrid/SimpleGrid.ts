import {SimpleGridData} from "./SimpleGridData";
import {SimpleGridTable} from "./SimpleGridTable";
import {SimpleGridSortableHeader} from "./SimpleGridSortableHeader";
import {SimpleGridRecord} from "./SimpleGridRecord";
import {SimpleGridDataImage} from "./SimpleGridDataImage";
import {StoreModel} from "../../models/StoreModel";

export const SIMPLEGRID_DIRECTIVES:Array<any> = [SimpleGridTable, SimpleGridSortableHeader, SimpleGridRecord, SimpleGridData, SimpleGridDataImage];

export interface ISimpleGridEdit {
    value:string;
    item:StoreModel;
}
