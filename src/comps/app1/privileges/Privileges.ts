import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from 'angular2/core'
import {Loading} from "../../loading/Loading";
import {SimpleList, ISimpleListItem} from "../../simplelist/Simplelist";
import {PrivelegesModel} from "../../../reseller/PrivelegesModel";
import {List} from 'immutable';
import {AppStore} from "angular2-redux-util/dist/index";
import {CanActivate, ComponentInstruction} from "angular2/router";
import {AuthService} from "../../../services/AuthService";
import {appInjService} from "../../../services/AppInjService";

@Component({
    selector: 'privileges',
    directives: [Loading, SimpleList],
    template: `
        <div class="row">
             <div class="col-xs-3">
                <div style="position: relative; top: 10px">
                    <!--<a class="btns" href="#"><span class="fa fa-plus"></span></a>-->
                    <!--<a class="btns" [ngClass]="{disabled: !businessesListFiltered || businessesListFiltered && businessesListFiltered.size != 1}" href="#"><span class="fa fa-remove"></span></a>-->
                </div>
                <SimpleList *ngIf="privelegesList" #simpleList [list]="privelegesList" 
                    (selected)="onFilteredSelection()"
                    (iconClicked)="onShowUserInfo($event)"
                    [multi]="false"
                    [contentId]="getBusinessesId()"
                    [content]="getBusinesses()">
                </SimpleList>
                <Loading *ngIf="!privelegesList" [src]="'assets/preload6.gif'" [style]="{'margin-top': '150px'}"></Loading>
             </div>
             <div class="col-xs-9 userView">                
                <Loading *ngIf="!privelegesList" [src]="'assets/preload6.gif'" [style]="{'margin-top': '150px'}"></Loading>
             </div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
@CanActivate((to:ComponentInstruction, from:ComponentInstruction) => {
    let authService:AuthService = appInjService().get(AuthService);
    return authService.checkAccess(to, from, ['/Login/Login']);
})
export class Privileges {
    @Input()
    parts = [];
    @Input()
    partsInCart:string;

    @Output()
    addToCart:EventEmitter<any> = new EventEmitter();

    private unsub;
    private privelegesList:List<PrivelegesModel>

    constructor(private appStore:AppStore) {
        var i_reseller = this.appStore.getState().reseller;

        this.privelegesList = i_reseller.getIn(['privileges']);
        this.unsub = this.appStore.sub((privelegesModel:List<PrivelegesModel>) => {
            this.privelegesList = privelegesModel;
        }, 'reseller.privileges');

    }

    private onFilteredSelection() {
        // this.showUserInfo = null;
        // if (!this.simpleList)
        //     return;
        // var businessSelected = this.simpleList.getSelected();
        //
        // this.businessesListFiltered = this.businessesList.filter((businessModel:BusinessModel)=> {
        //     var businessId = businessModel.getBusinessId();
        //     return businessSelected[businessId] && businessSelected[businessId].selected;
        // }) as List<any>;
        //
        // let arr = [];
        // this.businessesListFiltered.forEach((businessModel:BusinessModel)=> {
        //     let businessModelId = businessModel.getBusinessId();
        //     this.businessesUsers.forEach((businessUser:BusinessUser) => {
        //         var businessUserId = businessUser.getBusinessId();
        //         if (businessUserId == businessModelId) {
        //             arr.push(businessUser);
        //         }
        //     })
        // })
        // this.businessUsersListFiltered = List<BusinessUser>(arr);
    }

    private onShowUserInfo(selectedBusiness:ISimpleListItem){
        // this.showUserInfo = selectedBusiness;
    }

    private getBusinesses() {
        // return (businessItem:BusinessModel)=> {
        //     return businessItem.getKey('name');
        // }
    }

    private getBusinessesId() {
        // return (businessItem:BusinessModel)=> {
        //     return businessItem.getKey('businessId');
        // }
    }

    private ngOnDestroy() {
        this.unsub();
    }
}

