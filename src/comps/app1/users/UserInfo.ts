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
    unsub2;
    unsub3;

    @Input()
    set user(i_user:List<BusinessModel>) {
        this.businessId = i_user.first().getKey('businessId');
        this.userName = i_user.first().getKey('name');
        this.maxMonitors = i_user.first().getKey('maxMonitors');
        this.businessDescription = i_user.first().getKey('businessDescription');
        this.lastLogin = i_user.first().getKey('lastLogin');
        this.allowSharing = i_user.first().getKey('allowSharing') == '0' ? '' : 'checked';
        this.studioVersion = i_user.first().getKey('studioLite') == 1 ? 'StudioLite' : 'StudioPro';
        this.studioIcon = this.studioVersion == 'StudioLite' ? 'fa-circle-o' : 'fa-circle';
        this.fromTemplateId = i_user.first().getKey('fromTemplateId');
        this.accountStatus = i_user.first().getKey('accountStatus');
        this.verifiedIcon = this.accountStatus == '2' ? 'fa-check' : 'fa-remove';
        this.resellerId = i_user.first().getKey('resellerId');

        //this.appStore.dispatch(this.businessActions.fetchBusinessUser(this.businessId));
        // this.businessActions.fetchBusinessUser2();
        this.businessActions.fetchBusinessUser2(Math.random());


        // this.businessActions.callServer('https://secure.digitalsignage.com/Digg')
        // this.businessActions.callServer('https://secure.digitalsignage.com/Digg')
        // this.businessActions.callServer('https://secure.digitalsignage.com/Digg')
        // this.businessActions.callServer('https://secure.digitalsignage.com/Digg')
        // this.businessActions.callServer('https://secure.digitalsignage.com/Digg')


        // this.unsub3 = this.businessActions.calls.httpResponse$.subscribe((e)=> {
        //     console.log(e)
        //     // this.sub2.unsubscribe();
        // })
        // this.businessActions.calls.get();
        // this.businessActions.calls.get();
        // this.businessActions.calls.get();

        // var http = this.businessActions.httpService('https://secure.digitalsignage.com/Digg');
        // self.unsub2 = http.httpResponse$.subscribe(resp => {
        //     console.log(resp)
        //     self.unsub2.unsubscribe();
        // });
        // http.get();
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

    ngOnDestroy() {
        this.unsub();
        // this.unsub2.unsubscribe();
        // this.unsub3.unsubscribe();
    }

    ngAfterViewChecked() {
        this.unsub = this.appStore.sub((businessUser:BusinessUser) => {
            this.nameEmail = businessUser.getKey('emailName');
            this.updateUi();
        }, 'business.businessUser');
    }
}

