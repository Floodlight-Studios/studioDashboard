import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from 'angular2/core'

@Component({
    selector: 'components',
    template: `<h3>Components coming soon...</h3>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Components {
    @Input()
    parts = [];
    @Input()
    partsInCart:string;

    @Output()
    addToCart:EventEmitter<any> = new EventEmitter();
}

