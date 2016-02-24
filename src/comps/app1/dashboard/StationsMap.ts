import {Component, OnInit} from 'angular2/core';
import {Http} from 'angular2/http';
import {Ng2Highmaps} from '../../ng2-highcharts/ng2-highcharts';

window['Highmaps'] = require('highcharts/modules/map')(Highcharts);

@Component({
    selector: 'StationsMap',
    directives: [Ng2Highmaps],
    template: `
       <div [ng2-highmaps]="chartMap" class="Map"></div>
       <div id="container" style="height: 500px; min-width: 310px; max-width: 800px; margin: 0 auto"></div>
    `
})
export class StationsMap implements OnInit {


    mapData = [
        {
            'code': 'DE.SH',
            'value': 728
        },
        {
            'code': 'DE.BE',
            'value': 710
        },
        {
            'code': 'DE.MV',
            'value': 963
        },
        {
            'code': 'DE.HB',
            'value': 541
        },
        {
            'code': 'DE.HH',
            'value': 622
        },
        {
            'code': 'DE.RP',
            'value': 866
        },
        {
            'code': 'DE.SL',
            'value': 398
        },
        {
            'code': 'DE.BY',
            'value': 785
        },
        {
            'code': 'DE.SN',
            'value': 223
        },
        {
            'code': 'DE.ST',
            'value': 605
        },
        {
            'code': 'DE.',
            'value': 361
        },
        {
            'code': 'DE.NW',
            'value': 237
        },
        {
            'code': 'DE.BW',
            'value': 157
        },
        {
            'code': 'DE.HE',
            'value': 134
        },
        {
            'code': 'DE.NI',
            'value': 136
        },
        {
            'code': 'DE.TH',
            'value': 704
        }
    ];
    chartStock = {};
    chartMap = {};

    // http://jsfiddle.net/gh/get/jquery/1.9.1/highslide-software/highcharts.com/tree/master/samples/maps/demo/map-bubble/
    // http://www.highcharts.com/samples/view.php?path=maps/demo/latlon-advanced
    // http://plnkr.co/edit/YX7W20?p=preview
    // https://github.com/SebastianM/angular2-google-maps

    constructor(private http:Http) {
        var self = this;
        jQuery.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=world-population.json&callback=?', function (data) {
            jQuery.getScript('https://code.highcharts.com/mapdata/custom/world.js',()=>{
                var mapData = Highcharts['geojson'](Highcharts['maps']['custom/world']);


                // jQuery('#container').highcharts('Map', {
                //     chart : {
                //         borderWidth : 1
                //     },
                //
                //     title: {
                //         text: 'World population 2013 by country'
                //     },
                //
                //     subtitle : {
                //         text : 'Demo of Highcharts map with bubbles'
                //     },
                //
                //     legend: {
                //         enabled: false
                //     },
                //
                //     mapNavigation: {
                //         enabled: true,
                //         buttonOptions: {
                //             verticalAlign: 'bottom'
                //         }
                //     },
                //
                //     series : [{
                //         name: 'Countries',
                //         mapData: mapData,
                //         color: '#E0E0E0',
                //         enableMouseTracking: false
                //     }, {
                //         type: 'mapbubble',
                //         mapData: mapData,
                //         name: 'Population 2013',
                //         joinBy: ['iso-a2', 'code'],
                //         data: data,
                //         minSize: 4,
                //         maxSize: '12%',
                //         tooltip: {
                //             pointFormat: '{point.code}: {point.z} thousands'
                //         }
                //     }]
                // });




                // Correct UK to GB in data
                jQuery.each(data, function () {
                    if (this.code === 'UK') {
                        this.code = 'GB';
                    }
                });

                self.chartMap = {
                    chart : {
                        borderWidth : 1
                    },

                    title: {
                        text: 'Stations map'
                    },

                    subtitle : {
                    },

                    legend: {
                        enabled: false
                    },

                    mapNavigation: {
                        enabled: true,
                        buttonOptions: {
                            verticalAlign: 'bottom'
                        }
                    },

                    series : [{
                        name: 'Countries',
                        mapData: mapData,
                        color: '#E0E0E0',
                        enableMouseTracking: false
                    }, {
                        type: 'mappoint',
                        name: 'Population 2013',
                        data: data,
                        maxSize: '12%',
                        mapData: mapData
                    }]
                };
            })
        });


    }

    ngOnInit():any {

        // this.http.get('assets/geojson.json').subscribe(
        //     geojson => {
        //         this.chartMap = {
        //             title: {
        //                 text: 'GeoJSON in Highmaps'
        //             },
        //             mapNavigation: {
        //                 enabled: true,
        //                 buttonOptions: {
        //                     verticalAlign: 'bottom'
        //                 }
        //             },
        //             colorAxis: {},
        //             series: [{
        //                 data: this.mapData,
        //                 mapData: geojson.json(),
        //                 joinBy: ['code_hasc', 'code'],
        //                 name: 'Random data',
        //                 states: {
        //                     hover: {
        //                         color: '#BADA55'
        //                     }
        //                 },
        //                 dataLabels: {
        //                     enabled: true,
        //                     format: '{point.properties.postal}'
        //                 }
        //             }]
        //         };
        //     },
        //     err => {
        //         console.error('Somethin went wrong', err);
        //     }
        // );
    }
}