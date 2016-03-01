import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChange} from 'angular2/core'
import {BusinessModel} from "../../../business/BusinesModel";
import {List} from 'immutable';
import {Infobox} from "../../infobox/Infobox";
import {UserStorage} from "./UserStorage";
import {InputEdit} from "../../inputedit/InputEdit";

@Component({
    selector: 'UserInfo',
    directives: [Infobox, UserStorage, InputEdit],
    templateUrl: `/src/comps/app1/users/UserInfo.html`,
    styleUrls: [`../comps/app1/users/UserInfo.css`],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserInfo {
    businessId:string;
    serverStats = [];
    serverStatsCategories = [];
    stylesObj;
    stylesDesc;


    @Input()
    set user(i_user:List<BusinessModel>) {
        this.businessId = i_user.first().getKey('businessId');
    }

    @Output()
    addToCart:EventEmitter<any> = new EventEmitter();

    constructor() {
        var w = '150px';
        this.stylesObj = {
            input: {
                'font-size': '0.7em',
                'color': 'dodgerblue',
                'overflow': 'hidden',
                'width': w
            },
            label: {
                'font-size': '0.7em',
                'color': '#333333',
                'overflow': 'hidden',
                'white-space': 'nowrap',
                'width': w

            }
        }
        this.stylesDesc = {
            input: {
                'padding-bottom': '4px',
                'font-size': '0.9em',
                'color': 'dodgerblue',
                'width': '200px',
                'overflow': 'hidden'
            },
            label: {
                'padding-bottom': '4px',
                'font-size': '0.9em',
                'color': '#333333',
                'width': '240px',
                'overflow': 'hidden'
            }
        }
    };
}

