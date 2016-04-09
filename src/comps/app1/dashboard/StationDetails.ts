import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChange} from 'angular2/core'
import {MODAL_DIRECTIVES} from "../../ng2-bs3-modal/ng2-bs3-modal";

@Component({
    selector: 'stationDetails',
    directives: [],
    template: `
        
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StationDetails {
    @Input()
    parts = [];
    @Input()
    partsInCart:string;

    private onModalClose($event) {
    }
}

