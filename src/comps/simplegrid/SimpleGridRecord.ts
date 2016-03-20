import {Component, Input, ChangeDetectionStrategy, HostListener, HostBinding, ElementRef} from 'angular2/core'
import {SimpleGridTable} from "./SimpleGridTable";
import {Observable} from "rxjs/Observable";

@Component({
    selector: 'tr[simpleGridRecord]',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
          <ng-content></ng-content>
    `
})
export class SimpleGridRecord {

    constructor(private elementRef:ElementRef) {
        var self = this;
        this.sub = Observable.fromEvent(self.elementRef.nativeElement, 'click')
            .subscribe(()=> {
                if (!self.selectable)
                    return;
                self.setSelected();
                return true;
            });
    }

    private sub;
    private m_table:SimpleGridTable
    private m_index;

    @Input()
    item;

    @Input()
    selectable:boolean = true;

    @Input()
    set table(i_table) {
        this.m_table = i_table;
    }

    // @HostListener('click', ['$event'])
    // onSelected() {
    //     if (!this.selectable)
    //         return;
    //     this.setSelected();
    //     return true;
    // }

    @HostBinding('class.selectedTr')
    selectedClass:boolean = false;

    @Input()
    set index(i_index:number) {
        this.m_index = i_index;
    }

    get index() {
        return this.m_index;
    }

    ngOnInit() {
        var selected:SimpleGridRecord = this.m_table.getSelected();
        // even though the index is same as this, the Immutable data model
        // is out of sync inside table, so we need to update to latest version of this
        if (selected && selected.m_index == this.index)
            this.setSelected();
    }

    private setSelected() {
        alert(1)
        this.m_table.setSelected(this);
        this.selectedClass = true;
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}

