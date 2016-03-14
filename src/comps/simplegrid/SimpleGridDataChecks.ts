import {
    Component, Input, ChangeDetectionStrategy, Output, EventEmitter, ViewChildren, QueryList, HostListener
} from 'angular2/core'
import {List} from "immutable";
import {StoreModel} from "../../models/StoreModel";

@Component({
    selector: 'td[simpleGridDataChecks]',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
        i {
            cursor: pointer;
        }
    `],
    template: `        
        <div *ngFor="#item of m_checkboxes">
          <label class="pull-left">{{item.name}}</label>
          <Input #checkInputs type="checkbox" [checked]="item" value="{{item}}" class="pull-left" style="margin-right: 2px">
        </div>
    `
})
export class SimpleGridDataChecks {

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

    @HostListener('click', ['$event'])
    onClick(e) {
        let values = []
        this.inputs.map(v=> {
            values.push(v.nativeElement.checked);
        });
        this.changed.next({item: this.m_storeModel, value: values});
        return true;
    }
}

