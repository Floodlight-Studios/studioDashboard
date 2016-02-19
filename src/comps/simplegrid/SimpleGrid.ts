import {Component, ChangeDetectionStrategy, Input} from "angular2/core";
import {SortableHeader} from "./SortableHeader";
import {FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators, AbstractControl, Control} from 'angular2/common'
import {COMMON_DIRECTIVES} from "angular2/common";
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/distinctUntilChanged';
import {OrderBy} from "../../pipes/OrderBy";

@Component({
    selector: 'SimpleGrid',
    changeDetection: ChangeDetectionStrategy.OnPush,
    pipes: [OrderBy],
    directives: [COMMON_DIRECTIVES],
    styles: [`input {margin: 20px; width: 50%}`],
    template: `
    <table class="table">
    <ng-content></ng-content>
      <!--<tbody>-->
        <!--<tr *ngFor="#item of list | OrderBy:sort.field:sort.desc">-->
          <!--<td>{{ item }}</td>-->
          <!--<td><img src="{{ item.iconPath }}" style="width: 40px; height: 40px"/></td>-->
          <!--<td>{{ item }}</td>-->
          <!--<td>{{ item }}</td>-->
          <!--&lt;!&ndash; <td [innerHtml]="item.day"></td> &ndash;&gt;-->
        <!--</tr>-->
      <!--</tbody>-->
    </table>
  `,
})

export class SimpleGrid {
    private zipControl:Control = new Control();
    private _metadata:Object = {};

    @Input()
    sort;
    @Input()
    list;
    @Input()
    content:((any)=>string);
    @Input()
    contentId:((any)=>string);


    constructor() {
    }

    private getMetadata(index, item) {
        let id = this.contentId ? this.contentId(item) : index;
        return this._metadata[id];
    }

    public getContentId(item, index):string {
        let id = this.contentId ? this.contentId(item) : index;
        if (this._metadata[id])
            return id;
        this._metadata[id] = {
            selected: false
        };
        return id;
    }

    public getContent(item):string {
        if (this.content) {
            return this.content(item);
        } else {
            return item;
        }
    }

    ngAfterViewInit() {
        this.zipControl.updateValue('91301');
    }

}
