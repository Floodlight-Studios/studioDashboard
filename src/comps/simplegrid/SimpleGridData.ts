import {Component, Input} from 'angular2/core'
import {StoreModel} from "../../models/StoreModel";

@Component({
    selector: 'td[simpleGridData]',
    template: `
         value: {{_value}}
         <!--<img src="{{ item.iconPath }}" style="width: 40px; height: 40px"/>-->
         <!--&lt;!&ndash; <td [innerHtml]="item.day"></td> &ndash;&gt;-->
    `
})
export class SimpleGridData {
    private _value;
    storeModel:StoreModel;

    @Input()
    set item(i_storeModel:StoreModel) {
        this.storeModel = i_storeModel
    }

    @Input()
    set type(field) {
        this._value = this.storeModel.getKey(field)
    }

}

