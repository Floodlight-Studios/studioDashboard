import {Component, Input, ChangeDetectionStrategy} from 'angular2/core'

@Component({
    selector: 'tr[simpleGridRecord]',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
    `],
    template: `
        <ng-content></ng-content>
    `
})
export class SimpleGridRecord {
    value;
    @Input()
    item;

    @Input()
    set index(value:number) {
        this.value = value;
    }
}

