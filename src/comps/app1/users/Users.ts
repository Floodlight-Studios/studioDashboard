import {Component, ViewChild, QueryList} from 'angular2/core'
import {CanActivate, ComponentInstruction} from "angular2/router";
import {SimpleList, ISimpleListItem} from "../../simplelist/SimpleList";
import {AppStore} from "angular2-redux-util/dist/index";
import {BusinessModel} from "../../../business/BusinessModel";
import {UsersDetails} from "./UsersDetails";
import {AuthService} from "../../../services/AuthService";
import {appInjService} from "../../../services/AppInjService";
import {BusinessUser} from "../../../business/BusinessUser";
import {Loading} from "../../loading/Loading";
import {List} from 'immutable';
import {PrivelegesModel} from "../../../reseller/PrivelegesModel";
import {DROPDOWN_DIRECTIVES} from "ng2-bootstrap/ng2-bootstrap";
import {BusinessAction} from "../../../business/BusinessAction";
import {AddUser} from "./AddUser";
import {MODAL_DIRECTIVES} from "../../ng2-bs3-modal/ng2-bs3-modal";
import {ModalComponent} from "../../ng2-bs3-modal/components/modal";
const bootbox = require('bootbox');

@Component({
    selector: 'Users',
    providers: [SimpleList],
    directives: [SimpleList, UsersDetails, Loading, DROPDOWN_DIRECTIVES, AddUser, MODAL_DIRECTIVES],
    styleUrls: ['../comps/app1/users/Users.css'],
    templateUrl: '/src/comps/app1/users/Users.html'
})

@CanActivate((to:ComponentInstruction, from:ComponentInstruction) => {
    let authService:AuthService = appInjService().get(AuthService);
    return authService.checkAccess(to, from, ['/Login/Login']);
})
export class Users {

    constructor(private appStore:AppStore, private businessAction:BusinessAction) {
        var i_businesses = this.appStore.getState().business;
        var i_reseller = this.appStore.getState().reseller;

        this.businessesList = i_businesses.getIn(['businesses']);
        this.unsub = this.appStore.sub((i_businesses:List<BusinessModel>) => {
            this.businessesList = i_businesses;
        }, 'business.businesses');

        this.businessesUsers = i_businesses.getIn(['businessUsers']);
        this.unsub2 = this.appStore.sub((businessUsers:List<BusinessUser>) => {
            this.businessesUsers = businessUsers;
            this.onFilteredSelection();
        }, 'business.businessUsers');

        this.priveleges = i_reseller.getIn(['privileges']);
        this.unsub3 = this.appStore.sub((privelegesModel:List<PrivelegesModel>) => {
            this.priveleges = privelegesModel;
        }, 'reseller.privileges');
    }

    @ViewChild(SimpleList)
    simpleList:SimpleList;

    @ViewChild(ModalComponent)
    modalAddUser:ModalComponent;

    @ViewChild(UsersDetails)
    usersDetails:UsersDetails;

    private businessesList:List<BusinessModel> = List<BusinessModel>();
    private businessesListFiltered:List<BusinessModel>
    private businessUsersListFiltered:List<BusinessUser>;
    private businessesUsers:List<BusinessUser>
    private priveleges:List<PrivelegesModel>
    private showUserInfo:Object = null;
    private unsub:Function;
    private unsub2:Function;
    private unsub3:Function;

    private onAddUser(choice) {
        switch (choice) {
            case 'Add account from sample':
            {
                break;
            }
            case 'Add a clean account':
            {
                this.modalAddUser.open('lg');
                break;
            }
            case 'Add an existing account':
            {
                break;
            }
        }
    }

    private getBusinessIdSelected():number {
        if (this.businessUsersListFiltered && this.businessUsersListFiltered.size > 0)
            return this.businessUsersListFiltered.first().getBusinessId();
    }

    private onRemoveUser() {
        if (!this.businessesListFiltered || this.businessesListFiltered.size != 1)
            return
        var businessModel:BusinessModel = this.businessesListFiltered.first();
        let businessId = businessModel.getBusinessId();
        bootbox.confirm(`Are you sure you want to remove business id ${businessId}? This cannot be undone and all configuration and user data will be permanently erased!!!`, (result) => {
            if (result) {
                this.appStore.dispatch(this.businessAction.removeBusiness(businessId));
                this.businessUsersListFiltered = null;
                this.showUserInfo = null;
            }
        });
    }

    private onModalClose($event) {
    }

    private onShowUserInfo(selectedBusiness:ISimpleListItem) {
        this.onFilteredSelection();
        this.showUserInfo = selectedBusiness;
    }

    private onFilteredSelection() {
        this.showUserInfo = null;
        if (!this.simpleList)
            return;
        var businessSelected = this.simpleList.getSelected();

        this.businessesListFiltered = this.businessesList.filter((businessModel:BusinessModel)=> {
            var businessId = businessModel.getBusinessId();
            return businessSelected[businessId] && businessSelected[businessId].selected;
        }) as List<any>;

        let arr = [];
        this.businessesListFiltered.forEach((businessModel:BusinessModel)=> {
            let businessModelId = businessModel.getBusinessId();
            this.businessesUsers.forEach((businessUser:BusinessUser) => {
                var businessUserId = businessUser.getBusinessId();
                if (businessUserId == businessModelId) {
                    arr.push(businessUser);
                }
            })
        })
        this.businessUsersListFiltered = List<BusinessUser>(arr);
    }

    private getBusinesses() {
        return (businessItem:BusinessModel)=> {
            return businessItem.getKey('name');
        }
    }

    private getBusinessesId() {
        return (businessItem:BusinessModel)=> {
            return businessItem.getKey('businessId');
        }
    }

    private ngOnDestroy() {
        this.unsub();
        this.unsub2();
        this.unsub3();
    }
}

