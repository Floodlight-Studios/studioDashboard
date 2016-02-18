import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChange} from 'angular2/core'
import {List} from 'immutable';
import {SimpleGrid} from "../../simplegrid/SimpleGrid";
import {SortableHeader} from "../../simplegrid/SortableHeader";

@Component({
    selector: 'UsersDetails',
    directives: [SimpleGrid, SortableHeader],
    template: `
    <h1>Users Details</h1>
        <SimpleGrid [sort]="sort" [list]="_businessIds">
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
    private _businessIds:List<string>;

    @Input()
    set businessIds(value) {
        this._businessIds = value;
    }

    // @Output()
    // addToCart:EventEmitter<any> = new EventEmitter();

    constructor() {
    }
}



