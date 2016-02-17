import {Component, Input, ChangeDetectionStrategy} from "angular2/core";
import {BusinessModel} from "./BusinesModel";

@Component({
    selector: 'BusinessViewItem',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `<li class="userItem">{{business.getKey('name')}}</li>`,
    styles: [`
        .userItem {
            padding-top: 10px;
            padding-bottom: 10px;
            list-style-type: none;

        }
    `]

})

export class BusinessViewItem {
    @Input()
    business: BusinessModel;
    constructor() {
        console.log();
    }
    ngOnChanges(changes) {
    }
}
