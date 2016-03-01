import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChange} from 'angular2/core'
import {BusinessModel} from "../../../business/BusinesModel";
import {List} from 'immutable';
import {Infobox} from "../../infobox/Infobox";
import {UserStorage} from "./UserStorage";

@Component({
    selector: 'UserInfo',
    directives: [Infobox, UserStorage],
    templateUrl: `/src/comps/app1/users/UserInfo.html`,
    styleUrls: [`../comps/app1/users/UserInfo.css`],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserInfo {
    businessId:string;
    serverStats = [];
    serverStatsCategories = [];

    @Input()
    set user(i_user:List<BusinessModel>){
        this.businessId = i_user.first().getKey('businessId');
    }

    @Output()
    addToCart:EventEmitter<any> = new EventEmitter();

    constructor(){
    }
}

