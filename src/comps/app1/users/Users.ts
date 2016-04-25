import {Component, ViewChild, ElementRef} from 'angular2/core'
import {CanActivate, ComponentInstruction} from "angular2/router";
import {SimpleList, ISimpleListItem} from "../../simplelist/SimpleList";
import {AppStore} from "angular2-redux-util/dist/index";
import {DROPDOWN_DIRECTIVES} from "ng2-bootstrap/ng2-bootstrap";
import {BusinessAction} from "../../../business/BusinessAction";
import {AddUser} from "./AddUser";
import {MODAL_DIRECTIVES} from "../../ng2-bs3-modal/ng2-bs3-modal";
import {ModalComponent} from "../../ng2-bs3-modal/components/modal";
import {BusinessModel} from "../../../business/BusinessModel";
import {UsersDetails} from "./UsersDetails";
import {AuthService} from "../../../services/AuthService";
import {appInjService} from "../../../services/AppInjService";
import {BusinessUser} from "../../../business/BusinessUser";
import {Loading} from "../../loading/Loading";
import {List} from 'immutable';
import {PrivelegesModel} from "../../../reseller/PrivelegesModel";
import {Samplelist} from "./Samplelist";
import {SampleModel} from "../../../business/SampleModel";
const bootbox = require('bootbox');
const _ = require('underscore');

@Component({
    selector: 'Users',
    providers: [SimpleList],
    directives: [SimpleList, UsersDetails, Loading, Samplelist, DROPDOWN_DIRECTIVES, AddUser, MODAL_DIRECTIVES],
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

        this.samples = i_businesses.getIn(['samples']);
        this.unsub = this.appStore.sub((i_samples:List<SampleModel>) => {
            this.samples = i_samples;
        }, 'business.samples');

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

    @ViewChild('modalAddUserSample')
    modalAddUserSample:ModalComponent;

    @ViewChild('modalAddUserDuplicate')
    modalAddUserDuplicate:ModalComponent;

    @ViewChild('importUserName')
    importUserName:ElementRef;

    @ViewChild('importUserPass')
    importUserPass:ElementRef;

    @ViewChild('modalAddUserExisting')
    modalAddUserExisting:ModalComponent;

    @ViewChild(UsersDetails)
    usersDetails:UsersDetails;

    private businessesList:List<BusinessModel> = List<BusinessModel>();
    private samples:List<SampleModel> = List<SampleModel>();
    private businessesListFiltered:List<BusinessModel>
    private businessUsersListFiltered:List<BusinessUser>;
    private businessesUsers:List<BusinessUser>
    private priveleges:List<PrivelegesModel>
    private showUserInfo:Object = null;
    private unsub:Function;
    private unsub2:Function;
    private unsub3:Function;
    private accounts = ['Add new account from template', 'Add new user under selected account', 'Import existing account'];

    private onAddUser(choice) {
        switch (choice) {
            case this.accounts[0]:
            {
                this.modalAddUserSample.open('lg');
                break;
            }
            case this.accounts[1]:
            {
                if (this.getSelectedBusinessId()==-1)
                    return bootbox.alert('you must first select a business from the list, to create the new account under...');
                this.modalAddUserDuplicate.open('lg');
                break;
            }
            case this.accounts[2]:
            {
                this.modalAddUserExisting.open('lg');
                break;
            }
        }
    }

    private onRemoveUser() {
        if (!this.businessesListFiltered || this.businessesListFiltered.size != 1)
            return
        var businessModel:BusinessModel = this.businessesListFiltered.first();
        let businessId = businessModel.getBusinessId();

        bootbox.prompt({
            title: "are you sure you want to delete this account, this operation cannot be undone! type your enterprise account password to confirm deletion!",
            inputType: "password",
            buttons: {
                confirm: {
                    className: "btn-danger",
                    label: "Delete"
                }
            },
            callback: (result) => {
                if (_.isNull(result))
                    return;
                var password = this.appStore.getState().appdb.get('credentials').get('pass');
                if (result == password) {
                    this.appStore.dispatch(this.businessAction.removeBusiness(businessId));
                    this.businessUsersListFiltered = null;
                    this.showUserInfo = null;
                } else {
                    bootbox.alert('enterprise password did not match so account remains');
                }
            }
        });
    }

    private onSelectedsample(businessId){
        this.modalAddUserSample.close();
        console.log(businessId);
        this.onAddUser(this.accounts[1]);
    }

    private onModalClose($event) {
    }

    private onImportUser(event) {
        var user = this.importUserName.nativeElement.value;
        var pass = this.importUserPass.nativeElement.value;
        if (user.length < 2 || pass.length < 2) {
            bootbox.alert('user or password entered are too short');
            return;
        }
        this.appStore.dispatch(this.businessAction.associateUser(user, pass));
        this.modalAddUserExisting.close();
    }

    private getSelectedBusinessId():number {
        if(!this.businessUsersListFiltered)
            return -1;
        return this.businessesListFiltered.first().getBusinessId();
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

