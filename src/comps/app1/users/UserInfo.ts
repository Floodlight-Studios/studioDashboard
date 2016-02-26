import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChange} from 'angular2/core'

@Component({
    selector: 'UserInfo',
    template: `
        <span style="font-size: 6em; color: grey" class="fa fa-user"></span>
        <h1>User Info</h1>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserInfo {
    @Input()
    user:string;

    @Output()
    addToCart:EventEmitter<any> = new EventEmitter();
}

