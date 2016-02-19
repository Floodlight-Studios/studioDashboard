import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChange} from 'angular2/core'
import {List} from 'immutable';
import {SimpleGrid} from "../../simplegrid/SimpleGrid";
import {SortableHeader} from "../../simplegrid/SortableHeader";
import {BusinessModel} from "../../../business/BusinesModel";
import {SimpleGridItem} from "../../simplegrid/SimpleGridItem";
import {OrderBy} from "../../../pipes/OrderBy";

@Component({
    selector: 'UsersDetails',
    directives: [SimpleGrid, SortableHeader, SimpleGridItem],
    pipes: [OrderBy],
    template: `
        <SimpleGrid>
            <thead>
            <tr>
              <th sortableHeader="name" [sort]="sort">name</th>
              <th>icon</th>
              <th sortableHeader="businessId" [sort]="sort">business</th>
              <th sortableHeader="fromTemplateId" [sort]="sort">templt</th>
            </tr>
          </thead>
          <tbody>
          <tr SimpleGridItem *ngFor="#item of _businesses | OrderBy:sort.field:sort.desc; #index=index"
           [item]="item">
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



