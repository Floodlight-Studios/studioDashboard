import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from 'angular2/core'

@Component({
    selector: 'accounts',
    template: `<h3>Accounts coming soon...</h3>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Account {
    @Input()
    parts = [];
    @Input()
    partsInCart:string;

    @Output()
    addToCart:EventEmitter<any> = new EventEmitter();
}

