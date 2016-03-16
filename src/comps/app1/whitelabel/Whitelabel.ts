import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from 'angular2/core'

@Component({
    selector: 'whitelabel',
    template: `<h3>Whitelabel coming soon...</h3>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Whitelabel {
    @Input()
    parts = [];
    @Input()
    partsInCart:string;

    @Output()
    addToCart:EventEmitter<any> = new EventEmitter();
}

