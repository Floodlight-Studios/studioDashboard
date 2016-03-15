import {
    Component, Input, ChangeDetectionStrategy, Output, EventEmitter, ViewChildren, QueryList, HostListener
} from 'angular2/core'
import {List} from "immutable";
import {StoreModel} from "../../models/StoreModel";

@Component({
    selector: 'td[simpleGridDataDropdown]',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
        i {
            cursor: pointer;
         }    
    `],
    template: `   
               <div class="btn-group">
                    <!--<select class="form-control longInput" [ngFormControl]="notesForm.controls['privileges']">-->
                    <select class="form-control longInput">
                      <option *ngFor="#dropItem of m_dropdown" [selected]="getSelected(dropItem)">{{dropItem.getKey(m_field)}}</option>
                    </select>
               </div>
        <!--<div *ngFor="#item of m_checkboxes">-->
          <!--<label class="pull-left">{{item.name}}</label>-->
          <!--<Input #checkInputs type="checkbox" [checked]="item.checked" value="{{item.value}}" class="pull-left" style="margin-right: 2px">-->
        <!--</div>-->
    `
})
export class SimpleGridDataDropdown {

    private m_dropdown:List<any>
    private m_storeModel:StoreModel;
    private m_field:string = '';
    private value:string = '';
    private m_testSelection:(dropItem:any, storeModel:StoreModel)=>'checked'|'';

    @ViewChildren('checkInputs')
    inputs:QueryList<any>

    @Input()
    set dropdown(i_dropdown:List<any>) {
        this.m_dropdown = i_dropdown
    }

    @Input()
    set item(i_storeModel:StoreModel) {
        this.m_storeModel = i_storeModel
    }

    @Input()
    set field(i_field) {
        this.m_field = i_field;
    }

    @Input()
    set testSelection(i_testSelection:(dropItem:any, storeModel:StoreModel)=>'checked'|'') {
        this.m_testSelection = i_testSelection;
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

    private getSelected(i_dropItem):string {
        if (this.m_testSelection) {
            return this.m_testSelection(i_dropItem, this.m_storeModel);
        }
        return '';
    }
}

