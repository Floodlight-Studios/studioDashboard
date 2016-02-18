import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChange} from 'angular2/core'
import {List} from 'immutable';
import {SimpleGrid} from "../../simplegrid/SimpleGrid";
import {SortableHeader} from "../../simplegrid/SortableHeader";
import {BusinessModel} from "../../../business/BusinesModel";

@Component({
    selector: 'UsersDetails',
    directives: [SimpleGrid, SortableHeader],
    template: `
    <h1>Users Details</h1>
        <SimpleGrid [sort]="sort" [list]="_businesses">
            <thead>
            <tr>
              <th>day</th>
              <th>icon</th>
              <th sortableHeader="maxtempF" [sort]="sort">high</th>
              <th sortableHeader="mintempF" [sort]="sort">low</th>
            </tr>
          </thead>
        </SimpleGrid>


    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersDetails {
    public sort: {field: string, desc: boolean} = {field: 'ABC', desc: false};
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



