import {Component, Input, Output, EventEmitter, ViewChild} from 'angular2/core'
import {Loading} from "../../loading/Loading";
import {SimpleList, ISimpleListItem} from "../../simplelist/Simplelist";
import {PrivelegesModel} from "../../../reseller/PrivelegesModel";
import {List} from 'immutable';
import {AppStore} from "angular2-redux-util/dist/index";
import {CanActivate, ComponentInstruction} from "angular2/router";
import {AuthService} from "../../../services/AuthService";
import {appInjService} from "../../../services/AppInjService";
import {PrivilegesDetails} from "./PrivilegesDetails";
var _ = require('underscore');

@Component({
    selector: 'privileges',
    directives: [Loading, SimpleList, PrivilegesDetails],
    template: `
        <div class="row">
             <div class="col-xs-3">
                <div style="position: relative; top: 10px">
                    <!--<a class="btns" href="#"><span class="fa fa-plus"></span></a>-->
                    <!--<a class="btns" [ngClass]="{disabled: !businessesListFiltered || businessesListFiltered && businessesListFiltered.size != 1}" href="#"><span class="fa fa-remove"></span></a>-->
                </div>
                <SimpleList *ngIf="privelegesList" #simpleList [list]="privelegesList" 
                    (selected)="onPrivilegeSelected()"
                    (iconClicked)="onDefaultPrivilegeChanged($event)"
                    [multi]="false"
                    [iconSelectiondMode]="true"
                    [iconSelected]="getDefaultPrivilege()"
                    [contentId]="getPrivilegeId()"
                    [content]="getPrivilege()">
                </SimpleList>
                <Loading *ngIf="!privelegesList" [src]="'assets/preload6.gif'" [style]="{'margin-top': '150px'}"></Loading>
             </div>
             <div class="col-xs-9 userView">                
                <Loading *ngIf="!privelegesList" [src]="'assets/preload6.gif'" [style]="{'margin-top': '150px'}"></Loading>
                <privilegesDetails [selected]="privelegesModelSelected" [priveleges]="privelegesList" ></privilegesDetails>
             </div>
        </div>
    `
})
@CanActivate((to:ComponentInstruction, from:ComponentInstruction) => {
    let authService:AuthService = appInjService().get(AuthService);
    return authService.checkAccess(to, from, ['/Login/Login']);
})
export class Privileges {

    constructor(private appStore:AppStore) {
        var i_reseller = this.appStore.getState().reseller;

        this.privilegeDefault = i_reseller.getIn(['privilegeDefault']);
        this.unsub = this.appStore.sub((privilegeDefault:number) => {
            this.privilegeDefault = privilegeDefault;
        }, 'reseller.privilegeDefault');

        this.privelegesList = i_reseller.getIn(['privileges']);
        this.unsub = this.appStore.sub((privelegesModel:List<PrivelegesModel>) => {
            this.privelegesList = privelegesModel;
            this.onPrivilegeSelected();
        }, 'reseller.privileges');
    }

    @ViewChild(SimpleList)
    simpleList:SimpleList;

    @Input()
    parts = [];
    @Input()
    partsInCart:string;

    @Output()
    addToCart:EventEmitter<any> = new EventEmitter();

    private unsub;
    private privelegesList:List<PrivelegesModel>
    private privelegesModelSelected:PrivelegesModel;
    private privilegeDefault:number;

    private onDefaultPrivilegeChanged(event){
        for (var id in event.metadata) {
            if (event.metadata[id].index == event.index){
                console.log(id);
            }
        }
    }

    private onPrivilegeSelected() {
        if (!this.simpleList)
            return;
        var selected = this.simpleList.getSelected();
        var selectedList:List<PrivelegesModel> = this.privelegesList.filter((privelegesModel:PrivelegesModel)=> {
            var privelegesId = privelegesModel.getPrivelegesId();
            return selected[privelegesId] && selected[privelegesId].selected;
        }) as List<PrivelegesModel>;
       this.privelegesModelSelected = selectedList.first()// && selected[0];
    }

    private getPrivilege() {
         return (privelegesModel:PrivelegesModel)=> {
             return privelegesModel.getName();
         }
    }

    private getPrivilegeId() {
        return (privilegeModel:PrivelegesModel)=> {
            return privilegeModel.getPrivelegesId();
        }
    }

    private getDefaultPrivilege() {
        return (index, privelegesModel:PrivelegesModel)=>{
            if (privelegesModel.getPrivelegesId()== this.privilegeDefault)
                return true
            return false;
        }
    }

    private ngOnDestroy() {
        this.unsub();
    }
}

