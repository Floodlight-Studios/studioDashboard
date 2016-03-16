import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from 'angular2/core'

@Component({
    selector: 'privileges',
    template: `<h3>Privileges coming soon...</h3>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Privileges {
    @Input()
    parts = [];
    @Input()
    partsInCart:string;

    @Output()
    addToCart:EventEmitter<any> = new EventEmitter();
}

