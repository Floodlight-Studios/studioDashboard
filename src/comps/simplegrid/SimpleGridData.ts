import {Component, Input, ChangeDetectionStrategy} from 'angular2/core'
import {StoreModel} from "../../models/StoreModel";

@Component({
    selector: 'td[simpleGridData]',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
        label {
            width: 200px;
            padding: 0;
            margin: 0;
        }
        .editableLabel {
            cursor: pointer;
        }
        input {
            width: 179px;
            padding: 0;
            margin: 0;
        }
        a {
            cursor: pointer;
        }
    `],
    template: `
         <label [ngClass]="{editableLabel: _editModeEnable}" *ngIf="!_editMode" (click)="onEdit(true)">{{_value}}</label>
         <span *ngIf="_editMode">
            <input value="{{_value}}"/>
                <a (click)="onEdit(false)" class="fa fa-check"></a>
         </span>
         
         <!--<img src="{{ item.iconPath }}" style="width: 40px; height: 40px"/>-->
         <!--&lt;!&ndash; <td [innerHtml]="item.day"></td> &ndash;&gt;-->
    `
})
export class SimpleGridData {
    private _value;
    private storeModel:StoreModel;
    private _editModeEnable:boolean = false;
    private _editMode:boolean = false;

    @Input()
    set item(i_storeModel:StoreModel) {
        this.storeModel = i_storeModel
    }

    @Input()
    set type(field) {
        this._value = this.storeModel.getKey(field)
    }

    @Input()
    set editable(i_editModeEnable) {
        this._editModeEnable = i_editModeEnable;
    }

    onEdit(value:boolean) {
        if (!this._editModeEnable)
            return;
        this._editMode = value;
    }

}

