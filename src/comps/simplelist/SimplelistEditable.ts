import {
    Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChange,
    ViewChild, QueryList
} from 'angular2/core'

@Component({
    selector: 'simpleListEditable',
    template: `
                <span *ngIf="!m_editing" class="li-content pull-left">{{getContent(item)}}</span>
                <input #editInput *ngIf="m_editing && editable" [(ngModel)]="m_value" class="li-content pull-left"  value="{{getContent(item)}}" />
                <span *ngIf="editable" (click)="onEdit(true)" class="editable fa {{m_icon}} pull-right"></span>
    `,
    styleUrls: ['../comps/simplelist/SimpleList.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimplelistEditable {
    @Input()
    item;
    @Input()
    content:((any)=>string);
    @Input()
    editable:boolean = false;
    @Output()
    editChange:EventEmitter<any> = new EventEmitter();

    private m_editing:boolean = false;
    private m_icon:string = 'fa-edit';
    private m_value:string = '';

    private onEdit(changed:boolean) {
        if (this.m_editing) {
            var delay = 100;
            this.m_icon = 'fa-edit';
            if (changed)
                this.editChange.emit({item: this.item, value: this.m_value});
        } else {
            var delay = 0;
            this.m_icon = 'fa-check';
        }
        // use small delay so you don't see a skip in data appending
        setTimeout(()=> this.m_editing = !this.m_editing, delay);
    }

    private getContent(item):string {
        if (this.content) {
            return this.content(item);
        } else {
            return item;
        }
    }

}

