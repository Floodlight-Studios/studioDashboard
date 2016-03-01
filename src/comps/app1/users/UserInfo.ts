import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChange} from 'angular2/core'
import {BusinessModel} from "../../../business/BusinesModel";
import {List} from 'immutable';

@Component({
    selector: 'UserInfo',
    templateUrl: `/src/comps/app1/users/UserInfo.html`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserInfo {
    businessId:string;
    
    @Input()
    set user(i_user:List<BusinessModel>){
        this.businessId = i_user.first().getKey('businessId');
    }

    @Output()
    addToCart:EventEmitter<any> = new EventEmitter();
}

