import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from 'angular2/core';
import {COMMON_DIRECTIVES} from "angular2/src/common/common_directives";
import {FilterPipe} from "../../pipes/FilterPipe";

@Component({
    selector: 'SimpleList',
    templateUrl: '/src/comps/simplelist/SimpleList.html',
    styleUrls: ['../comps/simplelist/SimpleList.css'],
    directives: [COMMON_DIRECTIVES],
    changeDetection: ChangeDetectionStrategy.OnPush,
    pipes: [FilterPipe]
})
export class SimpleList {

    filterValue = '';
    selectedIndex = -1;
    selectedItem = true;
    @Input() list:any[];
    @Input() content:((any)=>string);
    @Output() hover: EventEmitter<any> = new EventEmitter();
    @Output() current: EventEmitter<any> = new EventEmitter();

    constructor() {
    }

    private itemSelected(item, index){
        this.current.next(item);
        this.selectedIndex = index;
    }

    getContent(item):string {
        if (this.content) {
            return this.content(item);
        } else {
            return item;
        }
    }
}

