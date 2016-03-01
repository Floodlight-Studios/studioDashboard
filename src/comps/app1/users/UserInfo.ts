import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChange} from 'angular2/core'
import {BusinessModel} from "../../../business/BusinesModel";
import {List} from 'immutable';
import {Infobox} from "../../infobox/Infobox";

@Component({
    selector: 'UserInfo',
    directives: [Infobox],
    templateUrl: `/src/comps/app1/users/UserInfo.html`,
    styleUrls: [`../comps/app1/users/UserInfo.css`],
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

