// http://jsfiddle.net/dnbtkmyz/
// http://jsfiddle.net/gh/get/jquery/1.9.1/highslide-software/highcharts.com/tree/master/samples/maps/demo/map-bubble/
// http://www.highcharts.com/samples/view.php?path=maps/demo/latlon-advanced
// http://plnkr.co/edit/YX7W20?p=preview
// https://github.com/SebastianM/angular2-google-maps

import {Component, Input} from 'angular2/core';
import {Http} from 'angular2/http';
import {Ng2Highmaps} from '../../ng2-highcharts/ng2-highcharts';

window['Highmaps'] = require('highcharts/modules/map')(Highcharts);


@Component({
    selector: 'stationsMap',
    directives: [Ng2Highmaps],
    template: `
       <div id="container" style="height: 300px; min-width: 300px; margin: 0 auto">
       <div [ng2-highmaps]="chartMap" (init)="onInit($event)" class="Map"></div>
       </div>
    `
})
export class StationsMap {
    chartStock = {};
    chartMap = {};

    onInit(event){
        console.log(event);//.series[0].setData([1,2,3,4,5]);

        setTimeout(()=>{
            jQuery(event.el[0]).highcharts().series[1].setData(this.stationsData1)
        },3000)

        setTimeout(()=>{
            jQuery(event.el[0]).highcharts().series[1].setData(this.stationsData2)
        },5000)

        setTimeout(()=>{
            jQuery(event.el[0]).highcharts().series[1].setData(this.stationsData3)
        },7000)
    }

    private stationsData1;
    private stationsData2;
    private stationsData3;

    constructor(private http:Http) {
        var self = this;

        this.stationsData1 = [{
            id: 'a',
            name: 'Janlor dr.',
            lat: 34.155621,
            lon: -118.788265,
            color: "red"
        }]

        this.stationsData2 = [{
            id: 'b',
            name: 'Moscow',
            lat: 55.7500,
            lon: 37.6167,
            color: "blue"
        }, {
            id: 'c',
            name: 'Beijing',
            lat: 39.9167,
            lon: 116.3833,
            color: "yellow"
        }, {
            id: 'd',
            name: 'Washington D.C.',
            lat: 38.889931,
            lon: -77.009003,
            color: "pink"
        }]

        this.stationsData3 = [{
            id: 'b',
            name: 'Moscow',
            lat: 55.7500,
            lon: 37.6167,
            color: "green"
        }, {
            id: 'c',
            name: 'Beijing',
            lat: 39.9167,
            lon: 116.3833,
            color: "green"
        }, {
            id: 'd',
            name: 'Washington D.C.',
            lat: 38.889931,
            lon: -77.009003,
            color: "green"
        }]


        jQuery.getScript('world_data.js', function (data) {
            jQuery.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=world-population.json&callback=?', function (data) {
                var mapData = Highcharts['maps']['custom/world'];
                self.chartMap = {
                    chart: {
                        borderWidth: 1,
                        height: 300
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
                    series: [{
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

    private m_stations;

    @Input()
    set stations(i_stations) {
        console.log(i_stations);
        this.m_stations = i_stations;
    }
}