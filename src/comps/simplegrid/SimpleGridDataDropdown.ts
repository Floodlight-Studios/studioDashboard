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
                  <div>
                        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
                        <span>Scrollable Menu this is a test 12</span> <span class="caret"></span></button>
                        <ul class="dropdown-menu scrollable-menu scrollbar" role="menu" >
                            <li><a href="#">Drop10</a></li>
                            <li><a href="#">Drop11</a></li>
                            <li><a href="#">Drop12</a></li>
                            <li><a href="#">Drop13</a></li>
                            <li><a href="#">Drop14</a></li>
                        </ul>
                        </div>
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

