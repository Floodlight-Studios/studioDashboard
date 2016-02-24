import {Component, View, OnInit, Input, ElementRef} from 'angular2/core';
import {Ng2Highcharts} from '../../ng2-highcharts/ng2-highcharts';

window['Highcharts'] = require('highcharts');

@Component({
    selector: 'ServerStats',
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
                <div [ng2-highcharts]="_options" (init)="onInit($event)" class="graph"></div>
            </div>
        </div>
    `,
    directives: [Ng2Highcharts]
})
export class ServerStats {

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
                text: ''
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
                    text: 'servers response time'
                }
            }, {
                title: {
                    text: 'measured in milliseconds'
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
        this._series = chart.series[0];

    }

}