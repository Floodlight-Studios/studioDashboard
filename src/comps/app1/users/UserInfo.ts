import {Component, Input, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef} from 'angular2/core'
import {BusinessModel} from "../../../business/BusinessModel";
import {Infobox} from "../../infobox/Infobox";
import {UserStorage} from "./UserStorage";
import {InputEdit} from "../../inputedit/InputEdit";
import {ISimpleListItem} from "../../simplelist/Simplelist";
import {ModalComponent} from "../../../comps/ng2-bs3-modal/components/modal";
import {MODAL_DIRECTIVES, ModalResult} from "../../ng2-bs3-modal/ng2-bs3-modal";
import {ChangePass} from "../../../comps/app1/users/ChangePass";

@Component({
    selector: 'UserInfo',
    directives: [Infobox, UserStorage, InputEdit, MODAL_DIRECTIVES, ChangePass],
    templateUrl: `/src/comps/app1/users/UserInfo.html`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: [`../comps/app1/users/UserInfo.css`]

})
export class UserInfo {

    constructor(private ref:ChangeDetectorRef) {
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
    }


    @ViewChild('modalChangePassword')
    modalChangePassword:ModalComponent;

    updateUi() {
        try {
            this.ref.detectChanges();
        } catch (e) {
        }
    }

    private onPasswordChange() {
        this.modalChangePassword.open('lg');
    }

    private onModalClose(result:ModalResult) {
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

