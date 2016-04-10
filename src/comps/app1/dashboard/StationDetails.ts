import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChange} from 'angular2/core'
import {MODAL_DIRECTIVES} from "../../ng2-bs3-modal/ng2-bs3-modal";

@Component({
    selector: 'stationDetails',
    directives: [],
    templateUrl: '/src/comps/app1/dashboard/StationDetails.html',
    styleUrls: ['../comps/app1/dashboard/StationDetails.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StationDetails {

    private onModalClose($event) {
    }
}

