import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy,} from 'angular2/core';
import {COMMON_DIRECTIVES} from "angular2/src/common/common_directives";
import {FilterPipe} from "../../pipes/FilterPipe";
import {List} from 'immutable';

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
    list:List<any>;
    @Input()
    content:((any)=>string);
    @Input()
    contentId:((any)=>string);
    @Input()
    icon:string;
    @Output()
    hover:EventEmitter<any> = new EventEmitter();
    @Output()
    current:EventEmitter<any> = new EventEmitter();
    @Output()
    selected:EventEmitter<any> = new EventEmitter();

    private itemSelected(item, index) {
        let id = this.contentId ? this.contentId(item) : index;
        this._metadata[id] = {
            selected: !this._metadata[id].selected
        };
        this.current.next({item, selected: this._metadata[id].selected});
        this.selected.next(this._metadata);
    }

    private itemAllSelected() {
        for (let id in this._metadata)
            this._metadata[id].selected = true;
        this.list.forEach((i_item)=> {
            this.current.next({item: i_item, selected: true});
            this.selected.next(this._metadata);
        })
    }

    private onIconClick(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        alert('icon clicked');
        return false;
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

    public getSelected() {
        return this._metadata;
    }
}

