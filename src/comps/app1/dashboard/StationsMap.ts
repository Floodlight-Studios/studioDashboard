// http://jsfiddle.net/dnbtkmyz/
// http://jsfiddle.net/gh/get/jquery/1.9.1/highslide-software/highcharts.com/tree/master/samples/maps/demo/map-bubble/
// http://www.highcharts.com/samples/view.php?path=maps/demo/latlon-advanced
// http://plnkr.co/edit/YX7W20?p=preview
// https://github.com/SebastianM/angular2-google-maps
// http://jsfiddle.net/kqck12da/2/
// http://jsfiddle.net/L6mf6yfo/1/
// http://jsfiddle.net/L6mf6yfo/1/
// http://jsfiddle.net/m93r6dsr/41/
// http://jsfiddle.net/omarshe7ta/m93r6dsr/40/

// add this one
// http://jsfiddle.net/gh/get/jquery/1.9.1/highslide-software/highcharts.com/tree/master/samples/stock/demo/dynamic-update/


import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef} from 'angular2/core';
import {Ng2Highmaps} from '../../ng2-highcharts/ng2-highcharts';
import {StationModel} from "../../../stations/StationModel";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';
import 'rxjs/add/observable/throw';
import {
    Headers,
    Http,
    Jsonp,
    HTTP_BINDINGS,
    Request,
    RequestOptions,
    RequestMethod,
    RequestOptionsArgs
} from 'angular2/http'
const bootbox = require('bootbox');
const _ = require('underscore');

window['Highmaps'] = require('highcharts/modules/map')(Highcharts);

@Component({
    selector: 'stationsMap',
    directives: [Ng2Highmaps],
    changeDetection: ChangeDetectionStrategy.Default,
    template: `
       <div id="container" style="height: 300px; min-width: 300px; margin: 0 auto">
       <div [ng2-highmaps]="chartMap" (init)="onInit($event)" class="Map"></div>
       </div>
    `
})
export class StationsMap {

    constructor(private http:Http) {
        this.initMap();
    }
    @Input()
    set stations(i_stations) {
        this.m_stations = i_stations;
        this.updateStations();
    }
    @Output() onStationSelected:EventEmitter<any> = new EventEmitter();

    private chartStock = {};
    protected chartMap = {};
    private highCharts:any;
    private m_stations;

    onInit(event) {
        console.log(event);//.series[0].setData([1,2,3,4,5]);
        this.highCharts = jQuery(event.el[0]).highcharts();
        this.updateStations();
    }

    private initMap() {
        var self = this;
        jQuery.getScript('world_data.js', function (data) {
            jQuery.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=world-population.json&callback=?', function (data) {
                var mapData = Highcharts['maps']['custom/world'];
                self.chartMap = {
                    chart: {
                        borderWidth: 1,
                        height: 380
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: 'Stations map'
                    },
                    subtitle: {},
                    legend: {
                        enabled: false
                    },
                    mapNavigation: {
                        enabled: true,
                        buttonOptions: {
                            verticalAlign: 'bottom'
                        }
                    },
                    plotOptions: {
                        series: {
                            point: {
                                events: {
                                    click: function () {
                                        self.onStationSelected.next(this.id);
                                        // alert(this.name + ' ' + this.id);
                                    }
                                }
                            }
                        }
                    },
                    tooltip: {enabled: false},
                    series: [{
                        dataLabels: {
                            enabled: true,
                            format: '{point.name}'
                        },
                        name: 'Countries',
                        mapData: mapData,
                    }, {
                        name: 'Points',
                        type: 'mappoint',
                        data: this.stationsData1
                    }]
                };
            });
        });
    }

    private getStationConnection(i_value) {
        if (i_value == 0)
            return 'red';
        if (i_value == 1)
            return 'green';
        if (i_value == 2)
            return 'yellow';
        return 'black';
    }

    private updateStations() {
        if (!this.m_stations)
            return;
        if (!this.highCharts)
            return;

        var stations = [];
        this.m_stations.forEach((i_station:StationModel)=> {
            var publicIp = i_station.getPublicIp();
            if (_.isEmpty(publicIp))
                return;
            stations.push({
                id: i_station.getStationId(),
                name: i_station.getKey('name'),
                publicIp: i_station.getPublicIp(),
                color: i_station.getConnectionIcon('color')
            });
        });
        var body = JSON.stringify(stations);
        var basicOptions:RequestOptionsArgs = {
            url: 'https://secure.digitalsignage.com/getGeoByIp',
            headers: new Headers({'Content-Type': 'application/json'}),
            method: RequestMethod.Post,
            body: body
        };
        var reqOptions = new RequestOptions(basicOptions);
        var req = new Request(reqOptions);
        //todo: change map stations data http service so its in service and not in component
        this.http.request(req)
            .catch((err) => {
                bootbox.alert('Error loading station map data 1');
                // return Observable.of(true);
                return Observable.throw(err);
            })
            .finally(() => {
                // console.log('done');
            })
            .map(result => {
                var stations = result.json();
                for (var station in stations){
                    var current = stations[station];
                    var rand = _.random(0,30)/100;
                    current.lat = current.lat + rand;
                    current.lon = current.lon + rand;
                }
                this.highCharts.series[1].setData(stations);
            }).subscribe();

    }
}

// if (this.m_stations){
//     this.highCharts.series[1].setData(this.stationsData3)
//}
// setTimeout(()=>{
//     jQuery(event.el[0]).highcharts().series[1].setData(this.stationsData1)
// },3000)
//
// setTimeout(()=>{
//     jQuery(event.el[0]).highcharts().series[1].setData(this.stationsData2)
// },5000)
//
// setTimeout(()=>{
//     jQuery(event.el[0]).highcharts().series[1].setData(this.stationsData3)
// },7000)

// this.stationsData2 = [{
//     id: 'b',
//     name: 'Moscow',
//     lat: 55.7500,
//     lon: 37.6167,
//     color: "blue"
// }, {
//     id: 'c',
//     name: 'Beijing',
//     lat: 39.9167,
//     lon: 116.3833,
//     color: "yellow"
// }, {
//     id: 'd',
//     name: 'Washington D.C.',
//     lat: 38.889931,
//     lon: -77.009003,
//     color: "pink"
// }]
//
// this.stationsData3 = [{
//     id: 'b',
//     name: 'Moscow',
//     lat: 55.7500,
//     lon: 37.6167,
//     color: "green"
// }, {
//     id: 'c',
//     name: 'Beijing',
//     lat: 39.9167,
//     lon: 116.3833,
//     color: "green"
// }, {
//     id: 'd',
//     name: 'Washington D.C.',
//     lat: 38.889931,
//     lon: -77.009003,
//     color: "green"
// }]
// private stationsData1;
// private stationsData2;
// private stationsData3;