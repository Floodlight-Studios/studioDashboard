import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChange} from 'angular2/core'
import {List} from 'immutable';
import {BusinessModel} from "../../../business/BusinesModel";
import {OrderBy} from "../../../pipes/OrderBy";
import {SIMPLEGRID_DIRECTIVES, ISimpleGridEdit} from "../../simplegrid/SimpleGrid";
import {AppStore} from "angular2-redux-util/dist/index";
import {BusinessAction} from "../../../business/BusinessAction";
import {UserInfo} from "./UserInfo";

@Component({
    selector: 'UsersDetails',
    changeDetection: ChangeDetectionStrategy.OnPush,
    directives: [SIMPLEGRID_DIRECTIVES, UserInfo],
    pipes: [OrderBy],
    styles: [`
            .embossed {
                font-size: 7.2em;
                background-color: #666666;
                -webkit-background-clip: text;
                -moz-background-clip: text;
                background-clip: text;
                color: transparent;
                text-shadow: rgba(255,255,255,0.5) 0px 3px 3px;
                margin: 50px auto;
                text-align: center;
                opacity: 0.3;
              }
              .embossedSmaller {
                font-size: 2em !important;
                position: relative;;
                top: -60px;
                letter-spacing: -1px;
              }
    `],

    template: `
    <br/>
    <div  *ngIf="!_businesses || _businesses.size == 0">
        <h1 class="embossed">USER DETAILS</h1>
        <h6 class="embossedSmaller embossed">select user(s) from the list to load up the related properties</h6>
    </div>
    <div *ngIf="_businesses && _businesses.size == 1">
        <UserInfo [user]="_businesses"></UserInfo>
    </div>
    <div *ngIf="_businesses && _businesses.size > 1">
         <simpleGridTable>
                <thead>
                <tr>
                  <th sortableHeader="name" [sort]="sort">name</th>
                  <th>login</th>
                  <th sortableHeader="businessId" [sort]="sort">business</th>
                  <th sortableHeader="studioLite" [sort]="sort">lite/pro</th>
                  <th sortableHeader="maxDataStorage" [sort]="sort">max gigs</th>
                  <th sortableHeader="maxMonitors" [sort]="sort">max screen</th>
                </tr>
              </thead>
              <tbody>                                                                          
              <tr class="simpleGridRecord" simpleGridRecord *ngFor="#item of _businesses | OrderBy:sort.field:sort.desc; #index=index" 
                [item]="item" [index]="index">
                    <td simpleGridData (labelEdited)="onLabelEdited($event,'name')" editable="true" field="name" [item]="item"></td>
                    <td simpleGridData field="lastLogin" [item]="item"></td>
                    <td simpleGridData field="businessId" [item]="item"></td>
                    <td simpleGridDataImage color="dodgerblue" [field]="item.getKey('studioLite') == '0' ? 'fa-circle' : 'fa-circle-o'" [item]="item"></td>
                    <td simpleGridData field="maxDataStorage" [item]="item"></td>
                    <td simpleGridData (labelEdited)="onLabelEdited($event,'maxMonitors')" editable="true" field="maxMonitors" [item]="item"></td>
              </tr>
              </tbody>                 
        </simpleGridTable>
    </div>
       
    `
})

export class UsersDetails {
    public sort:{field: string, desc: boolean} = {field: null, desc: false};
    private _businesses:List<BusinessModel>;

    private onLabelEdited(event:ISimpleGridEdit, field) {
        var value = event.value;
        var businessModel = event.item;
        var businessId = businessModel.getKey('businessId');
        this.appStore.dispatch(this.businessActions.setBusinessField(businessId, field, value));
    }

    @Input()
    set businesses(i_businesses) {
        this._businesses = i_businesses;
    }

    // @Output()
    // addToCart:EventEmitter<any> = new EventEmitter();

    constructor(private appStore:AppStore, private businessActions:BusinessAction) {
    }
}



