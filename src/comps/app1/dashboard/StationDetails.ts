import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChange} from 'angular2/core'
import {StationModel} from "../../../stations/StationModel";
const _ = require('underscore');

@Component({
    selector: 'stationDetails',
    directives: [],
    templateUrl: '/src/comps/app1/dashboard/StationDetails.html',
    styleUrls: ['../comps/app1/dashboard/StationDetails.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class StationDetails {

    constructor(){

    }
    private onModalClose($event) {
    }

    @Input()
    set station(i_selectedStation:StationModel){
        if (_.isUndefined(i_selectedStation))
            return;
        console.log(i_selectedStation);
    }
}

