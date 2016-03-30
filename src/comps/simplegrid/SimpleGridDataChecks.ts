import {
    Component, Input, ChangeDetectionStrategy, Output, EventEmitter, ViewChildren, QueryList, HostListener,
    ChangeDetectorRef
} from 'angular2/core'
import {List} from "immutable";
import {StoreModel} from "../../models/StoreModel";
const _ = require('underscore');

@Component({
    selector: 'td[simpleGridDataChecks]',
    changeDetection: ChangeDetectionStrategy.CheckOnce,
    styles: [`
        i {
            cursor: pointer;
        }
        .slideMode {
            padding-top: 8px;
            padding-right: 20px;
        }
    `],
    template: `
        <div *ngIf="!slideMode">
            <div *ngFor="#item of m_checkboxes">
              <label class="pull-left">{{item.name}}</label>
              <Input (click)="onClick()" #checkInputs type="checkbox" [checked]="item" value="{{item}}" class="pull-left" style="margin-right: 2px">
            </div>
        </div>
        <div *ngIf="slideMode" class="slideMode">
            <div *ngFor="#item of m_checkboxes" class="material-switch pull-right">
              <Input id="{{m_checkId}}"(mouseup)="onClick()" (click)="onClick()" #checkInputs type="checkbox" [checked]="item" value="{{item}}" class="pull-left" style="margin-right: 2px">
              <label [attr.for]="m_checkId" class="label-primary"></label>
          </div>
        </div>
    `
})
export class SimpleGridDataChecks {
    constructor(private cdr:ChangeDetectorRef) {
    }

    private m_checkId = _.uniqueId('slideCheck');
    private m_checkboxes:List<any>
    private m_storeModel:StoreModel;

    @ViewChildren('checkInputs')
    inputs:QueryList<any>

    @Input()
    set checkboxes(i_checkboxes:List<any>) {
        this.m_checkboxes = i_checkboxes
    }

    @Input()
    set item(i_storeModel:StoreModel) {
        this.m_storeModel = i_storeModel
    }

    @Input()
    slideMode:boolean = false;

    @Output()
    changed:EventEmitter<any> = new EventEmitter();

    //@HostListener('click', ['$event'])
    private onClick(e) {
        this.cdr.detach();
        let values = []
        this.inputs.map(v=> {
            values.push(v.nativeElement.checked);
        });
        this.changed.emit({item: this.m_storeModel, value: values});
        return true;
    }
}

