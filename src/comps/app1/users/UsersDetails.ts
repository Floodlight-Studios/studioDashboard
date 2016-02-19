import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChange} from 'angular2/core'
import {List} from 'immutable';
import {SimpleGrid} from "../../simplegrid/SimpleGrid";
import {SortableHeader} from "../../simplegrid/SortableHeader";
import {BusinessModel} from "../../../business/BusinesModel";
import {OrderBy} from "../../../pipes/OrderBy";
import {SimpleGridRecord} from "../../simplegrid/SimpleGridRecord";
import {SimpleGridData} from "../../simplegrid/SimpleGridData";

@Component({
    selector: 'UsersDetails',
    directives: [SimpleGrid, SortableHeader, SimpleGridRecord, SimpleGridData],
    pipes: [OrderBy],
    template: `
        <SimpleGrid>
            <thead>
            <tr>
              <th sortableHeader="name" [sort]="sort">name</th>
              <th>login</th>
              <th sortableHeader="businessId" [sort]="sort">business</th>
              <th sortableHeader="fromTemplateId" [sort]="sort">tmp</th>
            </tr>
          </thead>
          <tbody>                                                                          
          <tr SimpleGridRecord *ngFor="#item of _businesses | OrderBy:sort.field:sort.desc; #index=index" 
            [item]="item" [index]="index">
                <td SimpleGridData [type]="'name'" [item]="item"></td>
                <td SimpleGridData [type]="'lastLogin'" [item]="item"></td>
                <td SimpleGridData [type]="'businessId'" [item]="item"></td>
                <td SimpleGridData [type]="'fromTemplateId'" [item]="item"></td>
          </tr>
          </tbody>                 
        </SimpleGrid>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersDetails {
    public sort:{field: string, desc: boolean} = {field: null, desc: false};
    private _businesses:List<BusinessModel>;

    @Input()
    set businesses(i_businesses) {
        this._businesses = i_businesses;
    }

    // @Output()
    // addToCart:EventEmitter<any> = new EventEmitter();

    constructor() {
    }
}



