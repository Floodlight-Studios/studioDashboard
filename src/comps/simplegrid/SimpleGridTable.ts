import {Component, ChangeDetectionStrategy, Input, ViewEncapsulation} from "angular2/core";
import {SortableHeader} from "./SortableHeader";
import {Control} from 'angular2/common'
import {COMMON_DIRECTIVES} from "angular2/common";
import {OrderBy} from "../../pipes/OrderBy";
import {SimpleGridRecord} from "./SimpleGridRecord";
import {SimpleGridData} from "./SimpleGridData";

@Component({
    selector: 'SimpleGridTable',
    changeDetection: ChangeDetectionStrategy.OnPush,
    pipes: [OrderBy],
    directives: [COMMON_DIRECTIVES, SortableHeader, SimpleGridRecord, SimpleGridData],
    styleUrls: [`../comps/simplegrid/SimpleGrid.css`],
    template: `
    <table class="table simpleTable">
        <ng-content></ng-content>
    </table>
      <!--<tbody>-->
        <!--<tr *ngFor="#item of list | OrderBy:sort.field:sort.desc">-->
          <!--<td>{{ item }}</td>-->
          <!--<td><img src="{{ item.iconPath }}" style="width: 40px; height: 40px"/></td>-->
          <!--<td>{{ item }}</td>-->
          <!--<td>{{ item }}</td>-->
          <!--&lt;!&ndash; <td [innerHtml]="item.day"></td> &ndash;&gt;-->
        <!--</tr>-->
      <!--</tbody>-->
  `,
})

export class SimpleGridTable {
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
