import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from 'angular2/core'

@Component({
    selector: 'stations',
    template: `<h3>Stations coming soon...</h3>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Stations {
    @Input()
    parts = [];
    @Input()
    partsInCart:string;

    @Output()
    addToCart:EventEmitter<any> = new EventEmitter();
}

