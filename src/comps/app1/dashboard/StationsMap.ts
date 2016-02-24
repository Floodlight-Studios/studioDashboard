import {Component, OnInit} from 'angular2/core';
import {Http} from 'angular2/http';
import {Ng2Highmaps} from '../../ng2-highcharts/ng2-highcharts';

window['Highmaps'] = require('highcharts/modules/map')(Highcharts);

@Component({
    selector: 'StationsMap',
    moduleId: module.id,
    directives: [Ng2Highmaps],
    template: `
       <div [ng2-highmaps]="chartMap" class="graph"></div>
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

    constructor(private http:Http) {
        jQuery.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=world-population.json&callback=?', function (data) {
            //var mapData = Highcharts['geojson'](Highcharts['maps']['custom/world']);
            // var a = Highcharts.maps['custom/world']
            // var mapData = Highcharts.geojson(a);
            //console.log(mapData);
        });


    }

    ngOnInit():any {

        //Map
        this.http.get('assets/geojson.json').subscribe(
            geojson => {
                this.chartMap = {
                    title: {
                        text: 'GeoJSON in Highmaps'
                    },
                    mapNavigation: {
                        enabled: true,
                        buttonOptions: {
                            verticalAlign: 'bottom'
                        }
                    },
                    colorAxis: {},
                    series: [{
                        data: this.mapData,
                        mapData: geojson.json(),
                        joinBy: ['code_hasc', 'code'],
                        name: 'Random data',
                        states: {
                            hover: {
                                color: '#BADA55'
                            }
                        },
                        dataLabels: {
                            enabled: true,
                            format: '{point.properties.postal}'
                        }
                    }]
                };
            },
            err => {
                console.error('Somethin went wrong', err);
            }
        );
    }
}