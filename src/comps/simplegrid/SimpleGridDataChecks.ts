import {
    Component, Input, ChangeDetectionStrategy, Output, EventEmitter, ViewChildren, QueryList, HostListener,
    ChangeDetectorRef
} from 'angular2/core'
import {List} from "immutable";
import {StoreModel} from "../../models/StoreModel";

@Component({
    selector: 'td[simpleGridDataChecks]',
    changeDetection: ChangeDetectionStrategy.CheckOnce,
    styles: [`
        i {
            cursor: pointer;
        }
    `],
    template: `        
        <div *ngFor="#item of m_checkboxes">
          <label class="pull-left">{{item.name}}</label>
          <Input (click)="onClick()" #checkInputs type="checkbox" [checked]="item" value="{{item}}" class="pull-left" style="margin-right: 2px">
        </div>
    `
})
export class SimpleGridDataChecks {
    constructor(private cdr:ChangeDetectorRef) {
    }

    private t = 0;
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

    @Output()
    changed:EventEmitter<any> = new EventEmitter();

    //@HostListener('click', ['$event'])
    onClick(e) {
        this.cdr.detach();
        this.t++;
        console.log(this.t);
        if (this.t==2)
            return;
        let values = []
        this.inputs.map(v=> {
            values.push(v.nativeElement.checked);
        });
        this.changed.emit({item: this.m_storeModel, value: values});
        return true;
    }
}

