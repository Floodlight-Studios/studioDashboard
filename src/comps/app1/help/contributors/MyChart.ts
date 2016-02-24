import {Component, View, OnInit, Input, ElementRef} from 'angular2/core';
import {Ng2Highcharts} from '../../../ng2-highcharts/ng2-highcharts';

window['Highcharts'] = require('highcharts');

@Component({
    selector: 'MyChart',

})
@View({
    template: `
        <div style="width: 100%; height: 80%">
            
            <div *ngIf!="_data.length != 0">
                <div style="margin-top: 120px"></div>
                <center>
                    <img src="assets/preload5.gif">
                </center>
            </div>
            <div *ngIf="_data.length > 0">
                 <!-- <div [ng2-highcharts]="chartOptions" class="graph"></div> -->
                <div [ng2-highcharts]="_options" (init)="onInit($event)" class="graph"></div>
            </div>
        </div>

    `,
    directives: [Ng2Highcharts]
})
export class MyChart implements OnInit {

    _data;
    _options;
    _series;
    _chart

    @Input()
    set data(value) {
        this._data = value;
        if (this._series) {
            this._series.setData(value);
            return;
        }

        this._options = {
            chart: {
                type: 'column'
            },
            title: {
                text: 'mediaCLOUD server response'
            },
            xAxis: {
                categories: [
                    'Server1',
                    'Server2',
                    'Server3',
                    'Server4',
                    'Server5',
                    'Server6',
                    'Server7',
                    'Server8',
                    'Server9',
                    'Server10',
                    'Server11',
                    'Server12'
                ]
            },
            credits: {
                enabled: false
            },
            yAxis: [{
                min: 0,
                title: {
                    text: ''
                }
            }, {
                title: {
                    text: 'time milliseconds'
                },
                opposite: true
            }],
            legend: {
                enabled: false,
                shadow: false
            },
            tooltip: {
                shared: true
            },
            plotOptions: {
                column: {
                    grouping: false,
                    shadow: false,
                    borderWidth: 0
                }
            },
            series: [{
                data: this._data
            }]


        }
    }

    onInit(chart:HighchartsChartObject) {
        this._chart = chart;
        this._series = chart.series[0];//.setData([1,2,3,4,5]);
    }

    //chartOptions = {
    //    chart: {
    //        type: 'pie'
    //    },
    //    title: {
    //        text: 'Fruit Consumption'
    //    },
    //    xAxis: {
    //        categories: ['Apples', 'Bananas', 'Oranges']
    //    },
    //    yAxis: {
    //        title: {
    //            text: 'Fruit eaten'
    //        }
    //    },
    //    series: [{
    //        name: 'Jane',
    //        data: [1, 0, 4]
    //    }, {
    //        name: 'John',
    //        data: [5, 7, 3]
    //    }]
    //};


    // chartBar = {
    //     chart: {
    //         type: 'line'
    //     },
    //     xAxis: {
    //         categories: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    //     },
    //     credits: {
    //         enabled: false
    //     },
    //     series: [
    //         {
    //             name: 'NC',
    //             data: [7057, 6858, 6643, 6570, 6115, 107, 31, 635, 203, 2, 2]
    //         }, {
    //             name: 'OK',
    //             data: [54047, 52484, 50591, 49479, 46677, 33, 156, 947, 408, 6, 2]
    //         }, {
    //             name: 'KO',
    //             data: [11388, 11115, 10742, 10757, 10290, 973, 914, 4054, 732, 34, 2]
    //         }, {
    //             name: 'VALID',
    //             data: [8836, 8509, 8255, 7760, 7621, 973, 914, 4054, 732, 34, 2]
    //         }, {
    //             name: 'CHECK',
    //             data: [115, 162, 150, 187, 172, 973, 914, 4054, 732, 34, 2]
    //         }, {
    //             name: 'COR',
    //             data: [12566, 12116, 11446, 10749, 10439, 973, 914, 4054, 732, 34, 2]
    //         }
    //     ]
    // };

    ngOnInit():any {
        // setInterval(() => {
        //     this.chartBar = {
        //         chart: {
        //             type: 'pie'
        //         },
        //         xAxis: {
        //             categories: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        //         },
        //         credits: {
        //             enabled: false
        //         },
        //         series: [
        //             {
        //                 name: 'NC',
        //                 data: [7057, 6858, 6643, 6570, 6115, 107, 31, 635, 203, 2, 2]
        //             }, {
        //                 name: 'OK',
        //                 data: [54047, 52484, 50591, 49479, 46677, 33, 156, 947, 408, 6, 2]
        //             }, {
        //                 name: 'KO',
        //                 data: [11388, 11115, 10742, 10757, 10290, 973, 914, 4054, 732, 34, 2]
        //             }, {
        //                 name: 'VALID',
        //                 data: [8836, 8509, 8255, 7760, 7621, 973, 914, 4054, 732, 34, 2]
        //             }, {
        //                 name: 'CHECK',
        //                 data: [115, 162, 150, 187, 172, 973, 914, 4054, 732, 34, 2]
        //             }, {
        //                 name: 'COR',
        //                 data: [12566, 12116, 11446, 10749, 10439, 973, 914, 4054, 732, 34, 2]
        //             }
        //         ]
        //     };
        // }, 3000);
    }
}