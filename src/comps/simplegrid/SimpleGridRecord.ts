import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChange} from 'angular2/core'
import {BusinessModel} from "../../business/BusinesModel";
import * as _ from 'lodash';

@Component({
    selector: '[SimpleGridRecord]',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
            <ng-content></ng-content>
            <!--<td>{{_name}}</td>-->
            <!--<td>simple2</td>-->
            <!--<td>{{_businessId}}</td>-->
            <!--<td>{{_fromTemplateId}}</td>-->
    `
})
export class SimpleGridRecord {
    @Input()
    parts = [];
    @Input()
    set item(value:BusinessModel){
        this._name = value.getKey('name');
        this._businessId = value.getKey('businessId');
        this._fromTemplateId = value.getKey('fromTemplateId');
    }
    @Input()
    set index(value:number){
        console.log(value);
    }

    @Output()
    addToCart:EventEmitter<any> = new EventEmitter();
    _name:any;
    _businessId:any
    _fromTemplateId:any
    constructor(){

    }

    private random(){
        return _.random(1,1000);
    }

}

