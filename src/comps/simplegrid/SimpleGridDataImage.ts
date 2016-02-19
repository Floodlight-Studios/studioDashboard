import {Component, Input, ChangeDetectionStrategy} from 'angular2/core'
import {StoreModel} from "../../models/StoreModel";

@Component({
    selector: 'td[simpleGridDataImage]',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
        i {
            cursor: pointer;
        }
    `],
    template: `
        <i (click)="onClick($event)" style="color: dodgerblue; font-size: 1.5em" class="fa {{_value}}"></i>
         <!--<img src="{{ _value }}" style="width: 40px; height: 40px"/>-->
    `
})
export class SimpleGridDataImage {
    private _value;
    storeModel:StoreModel;

    @Input()
    set item(i_storeModel:StoreModel) {
        this.storeModel = i_storeModel
    }

    @Input()
    set type(field) {
        this._value = field;
    }

    onClick(event){
        alert(event)
    }

}

