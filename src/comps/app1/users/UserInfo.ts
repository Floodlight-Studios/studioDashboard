import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChange} from 'angular2/core'
import {BusinessModel} from "../../../business/BusinesModel";
import {List} from 'immutable';

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
    set user(i_user:List<BusinessModel>){
        console.log(i_user.first().getKey('businessId'));
    }


    @Output()
    addToCart:EventEmitter<any> = new EventEmitter();
}

