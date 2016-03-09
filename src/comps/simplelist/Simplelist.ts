import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy,} from 'angular2/core';
import {COMMON_DIRECTIVES} from "angular2/src/common/common_directives";
import {FilterPipe} from "../../pipes/FilterPipe";
import {List} from 'immutable';
let _ = require('underscore');

export interface  ISimpleListItem {
    item: any,
    index: number,
    selected: boolean
}

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
    private _editClickPending = false;
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
    iconClicked:EventEmitter<any> = new EventEmitter();
    @Output()
    current:EventEmitter<any> = new EventEmitter();
    @Output()
    selected:EventEmitter<any> = new EventEmitter();

    private itemSelected(item, index) {
        let id = this.contentId ? this.contentId(item) : index;
        this._metadata[id] = {
            item: item,
            index: index,
            selected: this._editClickPending ? true : !this._metadata[id].selected
        }

        this._editClickPending = false;
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

    private onIconClick(event, index) {
        var self = this;
        this._editClickPending = true;
        setTimeout(()=> {
            let match = _.find(self._metadata, (i) => i.index == index);
            console.log(match.item.getBusinessId() + ' ' + match.item.getKey('name'));
            this.iconClicked.next({
                item: match,
                target: event.target,
                index: index
            });
        }, 300)
        return true;
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

