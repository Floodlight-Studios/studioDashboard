import {Component, Input, ChangeDetectionStrategy, HostListener, HostBinding} from 'angular2/core'
import {SimpleGridTable} from "./SimpleGridTable";

@Component({
    selector: 'tr[simpleGridRecord]',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <ng-content></ng-content>
    `
})
export class SimpleGridRecord {
    private m_table:SimpleGridTable
    private m_index;

    @Input()
    item;

    @Input()
    set table(i_table) {
        this.m_table = i_table;
    }

    @HostListener('click', ['$event'])
    onSelected() {
        this.setSelected();
        return true;
    }

    @HostBinding('class.selectedTr')
    selectedClass:boolean = false;

    @Input()
    set index(i_index:number) {
        this.m_index = i_index;
    }

    get index(){
        return this.m_index;
    }

    ngOnInit() {
        var selected:SimpleGridRecord = this.m_table.getSelected();
        // even though the index is same as this, the Immutable data model
        // is out of sync inside table, so we need to update to latest version of this
        if (selected && selected.m_index == this.index)
            this.setSelected();
    }

    private setSelected(){
        this.m_table.setSelected(this);
        this.selectedClass = true;
    }
}

