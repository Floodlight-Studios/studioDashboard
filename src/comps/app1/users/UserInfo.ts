import {
    Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChange,
    ChangeDetectorRef, ApplicationRef, NgZone
} from 'angular2/core'
import {BusinessModel} from "../../../business/BusinessModel";
import {List} from 'immutable';
import {Infobox} from "../../infobox/Infobox";
import {UserStorage} from "./UserStorage";
import {InputEdit} from "../../inputedit/InputEdit";
import {AppStore} from "angular2-redux-util/dist/index";
import {BusinessUser} from "../../../business/BusinessUser";
import {BusinessAction} from "../../../business/BusinessAction";
import {ISimpleListItem} from "../../simplelist/Simplelist";

@Component({
    selector: 'UserInfo',
    directives: [Infobox, UserStorage, InputEdit],
    templateUrl: `/src/comps/app1/users/UserInfo.html`,
    // changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: [`../comps/app1/users/UserInfo.css`]

})
export class UserInfo {
    businessId:string;
    nameEmail;
    serverStats = [];
    serverStatsCategories = [];
    stylesObj;
    stylesDesc;
    userName;
    maxMonitors;
    businessDescription;
    lastLogin;
    studioVersion;
    studioIcon;
    allowSharing = '';
    accountStatus;
    resellerId;
    verifiedIcon;
    fromTemplateId;
    unsub;

    @Input()
    set user(i_simpleListItem:ISimpleListItem) {
        var businessUser:BusinessModel = i_simpleListItem.item.item;
        this.businessId = businessUser.getBusinessId();
        this.userName = businessUser.getKey('name');
        this.maxMonitors = businessUser.getKey('maxMonitors');
        this.businessDescription = businessUser.getKey('businessDescription');
        this.lastLogin = businessUser.getKey('lastLogin');
        this.allowSharing = businessUser.getKey('allowSharing') == '0' ? '' : 'checked';
        this.studioVersion = businessUser.getKey('studioLite') == 1 ? 'StudioLite' : 'StudioPro';
        this.studioIcon = this.studioVersion == 'StudioLite' ? 'fa-circle-o' : 'fa-circle';
        this.fromTemplateId = businessUser.getKey('fromTemplateId');
        this.accountStatus = businessUser.getKey('accountStatus');
        this.verifiedIcon = this.accountStatus == '2' ? 'fa-check' : 'fa-remove';
        this.resellerId = businessUser.getKey('resellerId');

        //this.appStore.dispatch(this.businessActions.fetchBusinessUser(this.businessId));
    }

    constructor(private appStore:AppStore, private businessActions:BusinessAction, private ref:ChangeDetectorRef) {
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

    updateUi() {
        try {
            this.ref.detectChanges();
        } catch (e) {
        }
    }

    ngAfterViewChecked() {
        // this.unsub = this.appStore.sub((businessUsers:BusinessUsers) => {
        //     this.nameEmail = businessUsers.getKey('emailName');
        //     this.updateUi();
        // }, 'business.businessUsers');
    }

    ngOnDestroy() {
        //this.unsub();
        //this.appStore.dispatch(this.businessActions.fetchBusinessUser([]))
    }
}

