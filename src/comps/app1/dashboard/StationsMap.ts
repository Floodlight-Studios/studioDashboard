// http://jsfiddle.net/dnbtkmyz/
// http://jsfiddle.net/gh/get/jquery/1.9.1/highslide-software/highcharts.com/tree/master/samples/maps/demo/map-bubble/
// http://www.highcharts.com/samples/view.php?path=maps/demo/latlon-advanced
// http://plnkr.co/edit/YX7W20?p=preview
// https://github.com/SebastianM/angular2-google-maps

import {Component, OnInit} from 'angular2/core';
import {Http} from 'angular2/http';
import {Ng2Highmaps} from '../../ng2-highcharts/ng2-highcharts';

window['Highmaps'] = require('highcharts/modules/map')(Highcharts);


@Component({
    selector: 'StationsMap',
    directives: [Ng2Highmaps],
    template: `
       <div id="container" style="height: 300px; min-width: 300px; margin: 0 auto">
       <div [ng2-highmaps]="chartMap" class="Map"></div>
       </div>
    `
})
export class StationsMap {
    chartStock = {};
    chartMap = {};

    constructor(private http:Http) {
        var self = this;
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
                        data: [{
                            name: 'Janlor dr.',
                            lat: 34.155621,
                            lon: -118.788265,
                            color: "red"
                        }, {
                            name: 'Moscow',
                            lat: 55.7500,
                            lon: 37.6167,
                            color: "blue"
                        }, {
                            name: 'Beijing',
                            lat: 39.9167,
                            lon: 116.3833
                        }, {
                            name: 'Washington D.C.',
                            lat: 38.889931,
                            lon: -77.009003
                        }]
                    }]

                };
            });
        });

    }
}