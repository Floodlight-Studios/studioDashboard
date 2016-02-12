import {Component, Input, ChangeDetectionStrategy} from "angular2/core";
import {BusinessModel} from "./BusinesModel";

@Component({
    selector: 'BusinessViewItem',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `<li>{{business.getKey('businessId')}}</li>`
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
