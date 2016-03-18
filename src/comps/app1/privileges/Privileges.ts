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
                    [multi]="false"
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

        this.privelegesList = i_reseller.getIn(['privileges']);
        this.unsub = this.appStore.sub((privelegesModel:List<PrivelegesModel>) => {
            this.privelegesList = privelegesModel;
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

    private onPrivilegeSelected() {

        var selected = this.simpleList.getSelected();
        selected = this.privelegesList.filter((privelegesModel:PrivelegesModel)=> {
            var privelegesId = privelegesModel.getPrivelegesId();
            return selected[privelegesId] && selected[privelegesId].selected;
        });
       this.privelegesModelSelected = selected && selected[0];
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

    private ngOnDestroy() {
        this.unsub();
    }
}

