import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChange} from 'angular2/core'
import {BusinessModel} from "../../business/BusinesModel";
import * as _ from 'lodash';

@Component({
    selector: '[SimpleGridItem]',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
            <td>{{_name}}</td>
            <td>simple2</td>
            <td>{{_businessId}}</td>
            <td>{{_fromTemplateId}}</td>
    `
})
export class SimpleGridItem {
    @Input()
    parts = [];
    @Input()
    set item(value:BusinessModel){
        this._name = value.getKey('name');
        this._businessId = value.getKey('businessId');
        this._fromTemplateId = value.getKey('fromTemplateId');
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

