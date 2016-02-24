import {Component, View, OnInit, Input, ElementRef} from 'angular2/core';
import {Ng2Highcharts} from '../../ng2-highcharts/ng2-highcharts';

window['Highcharts'] = require('highcharts');

@Component({
    selector: 'ServerAvg',
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
export class ServerAvg {

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
                type: 'spline',
                animation: Highcharts['svg'], // don't animate in old IE
                marginRight: 10,
                events: {
                    load: function () {

                        // set up the updating of the chart each second
                        var series = this.series[0];
                        setInterval(function () {
                            var x = (new Date()).getTime(), // current time
                                y = Math.random();
                            series.addPoint([x, y], true, true);
                        }, 1000);
                    }
                }
            },
            title: {
                text: ''
           },

            xAxis: {
                labels: {
                    enabled: false
                },
                categories: []
            },
            credits: {
                enabled: false
            },
            yAxis: [{
                min: 0,
                title: {
                    text: 'average response time'
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
            series: [
                {
                    name: 'Random data',
                    data: (function () {
                        var data = [],
                            time = (new Date()).getTime(),
                            i;

                        for (i = -60; i <= 0; i++) {
                            data.push({
                                x: time + i * 1000,
                                y: 0
                                // y: Math.random()
                            });
                        }
                        return data;
                    })()
                }
            ]
        }
    }

    onInit(chart:HighchartsChartObject) {
        this._chart = chart;
        this._series = chart.series[0];

    }

}