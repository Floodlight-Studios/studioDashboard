import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from 'angular2/core'
import {Loading} from "../../loading/Loading";
import {SimpleList} from "../../simplelist/Simplelist";

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
                <!--<SimpleList *ngIf="businessesUsers && priveleges" #simpleList [list]="businessesList" -->
                    <!--(selected)="onFilteredSelection()"-->
                    <!--(iconClicked)="onShowUserInfo($event)"-->
                    <!--[contentId]="getBusinessesId()"-->
                    <!--[icon]="'fa-user'"-->
                    <!--[content]="getBusinesses()">-->
                <!--</SimpleList>-->
                <!--<Loading *ngIf="!businessesUsers || !priveleges" [src]="'assets/preload6.gif'" [style]="{'margin-top': '150px'}"></Loading>-->
             </div>
             <div class="col-xs-9 userView">                
               <Loading [src]="'assets/preload6.gif'" [style]="{'margin-top': '150px'}"></Loading>
             </div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Privileges {
    @Input()
    parts = [];
    @Input()
    partsInCart:string;

    @Output()
    addToCart:EventEmitter<any> = new EventEmitter();
}

