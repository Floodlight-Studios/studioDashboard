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
    
    private m_selectedStation:StationModel;
    private m_ip:string = '';

    // @Input() station:StationModel;

    @Input()
    set station(i_selectedStation:StationModel){
        if (_.isUndefined(i_selectedStation))
            return;
        this.m_selectedStation = i_selectedStation;
        // this.m_selectedStation.getPublicIp()
        // this.m_selectedStation.getLocalIp()
        // this.m_selectedStation.getLocation().lat
        // this.m_selectedStation.getLocation().lon
        // this.m_selectedStation.getLocation().city
        // this.m_selectedStation.getLocation().country
    }
}

