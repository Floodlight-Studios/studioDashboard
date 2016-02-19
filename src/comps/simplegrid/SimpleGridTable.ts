import {Component, ChangeDetectionStrategy, Input} from "angular2/core";
import {SimpleGridSortableHeader} from "./SimpleGridSortableHeader";
import {COMMON_DIRECTIVES} from "angular2/common";
import {OrderBy} from "../../pipes/OrderBy";
import {SimpleGridRecord} from "./SimpleGridRecord";
import {SimpleGridData} from "./SimpleGridData";

@Component({
    selector: 'SimpleGridTable',
    changeDetection: ChangeDetectionStrategy.OnPush,
    pipes: [OrderBy],
    directives: [COMMON_DIRECTIVES, SimpleGridSortableHeader, SimpleGridRecord, SimpleGridData],
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
    @Input()
    sort;
    @Input()
    list;
    // private zipControl:Control = new Control();
    // ngAfterViewInit() {
    //     this.zipControl.updateValue('91301');
    // }
}
