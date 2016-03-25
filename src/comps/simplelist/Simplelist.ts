import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy,} from 'angular2/core';
import {COMMON_DIRECTIVES} from "angular2/src/common/common_directives";
import {FilterPipe} from "../../pipes/FilterPipe";
import {List} from 'immutable';
import {SimplelistEditable} from "./SimplelistEditable";
let _ = require('underscore');

export interface  ISimpleListItem {
    item:any,
    index:number,
    selected:boolean
}

@Component({
    selector: 'SimpleList',
    templateUrl: '/src/comps/simplelist/Simplelist.html',
    styleUrls: ['../comps/simplelist/Simplelist.css'],
    directives: [COMMON_DIRECTIVES, SimplelistEditable],
    pipes: [FilterPipe],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimpleList {

    private filter:string = '';
    private m_icon:string = '';
    private m_editing:boolean = false;
    private m_iconSelected:string = '';
    private m_iconSelectedIndex:number = -1;
    private m_iconSelectedMode:boolean = false;
    private m_metadata:Object = {};
    private m_editClickPending = false;

    @Input()
    list:List<any>;

    @Input()
    multi:boolean = true;

    @Input()
    editable:boolean = false;

    @Input()
    content:((any)=>string);

    @Input()
    contentId:((any)=>string);

    @Input()
    iconSelected:((index:number, item:any)=>boolean);

    @Input()
    set icon(i_icon:string) {
        this.m_icon = i_icon;
    }

    @Input()
    set iconSelectiondMode(mode:boolean) {
        if (mode) {
            this.m_iconSelectedMode = true;
            this.m_icon = 'fa-circle-o'
            this.m_iconSelected = 'fa-check-circle'
        }
    }

    @Output()
    hover:EventEmitter<any> = new EventEmitter();

    @Output()
    iconClicked:EventEmitter<any> = new EventEmitter();

    @Output()
    selected:EventEmitter<any> = new EventEmitter();

    @Output()
    edited:EventEmitter<any> = new EventEmitter();

    private onEditChanged(event){
        this.edited.emit((event))
    }

    private itemSelected(item, index) {
        let id = this.contentId ? this.contentId(item) : index;
        if (!this.multi) {
            for (let id in this.m_metadata) {
                this.m_metadata[id] = {
                    selected: false
                }
            }
        }
        this.m_metadata[id] = {
            item: item,
            index: index,
            selected: this.m_editClickPending ? true : !this.m_metadata[id].selected

        }
        if (this.m_editClickPending) {
            this.m_editClickPending = false;
            return;
        }
        //this.current.next({item, selected: this.m_metadata[id].selected});
        this.selected.next(this.m_metadata);

    }

    private renderIcon(index, item) {
        if (!this.m_iconSelectedMode)
            return this.m_icon;
        if (this.iconSelected) {
            if (this.iconSelected(index, item)) {
                this.m_iconSelectedIndex = index;
                return this.m_iconSelected;
            } else {
                return this.m_icon;
            }
        }
        if (index == this.m_iconSelectedIndex)
            return this.m_iconSelected;
        return this.m_icon;
    }

    private itemAllSelected() {
        for (let id in this.m_metadata)
            this.m_metadata[id].selected = true;
        this.list.forEach((i_item)=> {
            //this.current.next({item: i_item, selected: true});
            this.selected.next(this.m_metadata);
        })
    }

    private onIconClick(event, index) {
        var self = this;
        this.m_editClickPending = true;
        this.m_iconSelectedIndex = index;
        setTimeout(()=> {
            let match = _.find(self.m_metadata, (i) => i.index == index);
            // console.log(match.item.getBusinessId() + ' ' + match.item.getKey('name'));
            this.iconClicked.next({
                item: match,
                target: event.target,
                index: index,
                metadata: this.m_metadata
            });
        }, 1)
        if (this.m_iconSelectedMode) {
            event.stopImmediatePropagation();
            event.preventDefault();
            return false;
        }
        return true;
    }

    private getMetadata(index, item) {
        let id = this.contentId ? this.contentId(item) : index;
        return this.m_metadata[id];
    }

    public getContentId(item, index):string {
        let id = this.contentId ? this.contentId(item) : index;
        if (!this.m_metadata[id])
            this.m_metadata[id] = {};
        this.m_metadata[id].index = index;
        return id;
        // if (this.m_metadata[id])
        //     return id;
        // this.m_metadata[id] = {
        //     selected: false
        // };
        // return id;
    }

    private getContent(item):string {
        if (this.content) {
            return this.content(item);
        } else {
            return item;
        }
    }

    public getSelected() {
        return this.m_metadata;
    }

    public set selectedIconIndex(i_index) {
        this.m_iconSelectedIndex = i_index;
    }

    public get selectedIconIndex() {
        return this.m_iconSelectedIndex;
    }
}

