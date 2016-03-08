import {Component, ChangeDetectionStrategy, Input, ContentChildren, QueryList} from "angular2/core";
import {SimpleGridSortableHeader} from "./SimpleGridSortableHeader";
import {COMMON_DIRECTIVES} from "angular2/common";
import {OrderBy} from "../../pipes/OrderBy";
import {SimpleGridRecord} from "./SimpleGridRecord";
import {SimpleGridData} from "./SimpleGridData";

@Component({
    selector: 'simpleGridTable',
    changeDetection: ChangeDetectionStrategy.OnPush,
    pipes: [OrderBy],
    directives: [COMMON_DIRECTIVES, SimpleGridSortableHeader, SimpleGridRecord, SimpleGridData],
    styleUrls: [`../comps/simplegrid/SimpleGrid.css`],
    template: `
        <table class="table simpleTable">
            <ng-content></ng-content>
        </table>      
  `,
})

export class SimpleGridTable {
    @Input()
    sort;

    @Input()
    list;

    private selected;

    @ContentChildren(SimpleGridRecord)
    simpleGridRecord:QueryList<SimpleGridRecord>;

    public setSelected(i_selected:SimpleGridRecord) {
        this.deselect();
        this.selected = i_selected;

        //var rec:BusinessUser = i_selected.item;
        //console.log(rec.getBusinessId() + ' ' + rec.getName() + ' ' + rec.getAccessMask());
    }

    public deselect(){
        this.selected = null;
        this.simpleGridRecord.map((i_simpleGridRecord:SimpleGridRecord) => {
            i_simpleGridRecord.selectedClass = false;
        })
    }

    public getSelected():SimpleGridRecord {
        return this.selected;
    }
}
