import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChange} from 'angular2/core'

@Component({
    selector: 'Samplelist',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: '/src/comps/app1/users/Samplelist.html',
    styleUrls: ['../comps/app1/users/Samplelist.css']
})
export class Samplelist {
    @Input()
    parts = [];
    @Input()
    partsInCart:string;

    @Output()
    addToCart:EventEmitter<any> = new EventEmitter();
}

