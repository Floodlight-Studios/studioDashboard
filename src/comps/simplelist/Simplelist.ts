import {
    Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ElementRef,
    ViewContainerRef, ContentChildren, QueryList, ViewChildren, ViewChild, ContentChild
} from 'angular2/core';
import {COMMON_DIRECTIVES} from "angular2/src/common/common_directives";
import {FilterPipe} from "../../pipes/FilterPipe";
import {BrowserDomAdapter} from "angular2/src/platform/browser/browser_adapter";

@Component({
    selector: 'SimpleList',
    //moduleId: module['id'],
    templateUrl: '/src/comps/simplelist/SimpleList.html',
    styleUrls: ['../comps/simplelist/SimpleList.css'],
    directives: [COMMON_DIRECTIVES],
    pipes: [FilterPipe],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimpleList {

    filterValue = '';
    selectedIndices = [];
    selectedItem = true;
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
    // @ViewChildren('ul')
    // listItems:QueryList<any>;
    // ngAfterViewChecked(){
    //     console.log(this.listItems);
    // }

    @ViewChildren('simpleItem')
    simpleItems:QueryList<any>;

    ngAfterViewChecked() {
        //console.log(this.simpleItems);
    }

    private el:HTMLElement;

    constructor(private viewContainer:ViewContainerRef) {
        this.el = viewContainer.element.nativeElement;
    }

    private itemSelected(item, index) {
        this.current.next(item);
        if (this.selectedIndices.indexOf(index) > -1)
            return this.selectedIndices = _.without(this.selectedIndices, index);
        this.selectedIndices.push(index);
    }

    private onSelectAll() {
        var self = this;
        this.simpleItems.map(i=> {
            self.selectedIndices.push(Number(i._appElement.nativeElement.id.split(':')[2]));
        });
    }

    public getSelected() {

    }

    public getContentId(item):string {
        if (!this.contentId)
            return '-1';
        return this.contentId(item);
    }

    public getContent(item):string {
        if (this.content) {
            return this.content(item);
        } else {
            return item;
        }
    }
}

