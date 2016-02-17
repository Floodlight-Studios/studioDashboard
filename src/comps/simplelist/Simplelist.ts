import {
    Component,
    Input,
    Output,
    EventEmitter,
    ChangeDetectionStrategy,
} from 'angular2/core';
import {COMMON_DIRECTIVES} from "angular2/src/common/common_directives";
import {FilterPipe} from "../../pipes/FilterPipe";

@Component({
    selector: 'SimpleList',
    templateUrl: '/src/comps/simplelist/SimpleList.html',
    styleUrls: ['../comps/simplelist/SimpleList.css'],
    directives: [COMMON_DIRECTIVES],
    pipes: [FilterPipe],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimpleList {

    private filter = '';
    private _metadata:Object = {};

    @Input()
    list:any[];
    @Input()
    content:((any)=>string);
    @Input()
    contentId:((any)=>string);
    @Output()
    hover:EventEmitter<any> = new EventEmitter();
    @Output()
    current:EventEmitter<any> = new EventEmitter();

    private itemSelected(item, index) {
        let id = this.contentId ? this.contentId(item) : index;
        this._metadata[id] = {
            selected: !this._metadata[id].selected
        };
        this.current.next({id, selected: this._metadata[id].selected});
    }

    private itemAllSelected() {
        for (let id in this._metadata) {
            this._metadata[id].selected = true;
            this.current.next({id, selected: this._metadata[id].selected});
        }
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
}

