import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChange} from 'angular2/core'
import {OrderBy} from "../../../pipes/OrderBy";
import {SIMPLEGRID_DIRECTIVES} from "../../simplegrid/SimpleGrid";
import {MODAL_DIRECTIVES} from "../../ng2-bs3-modal/ng2-bs3-modal";

@Component({
    selector: 'stationsGrid',
    directives: [SIMPLEGRID_DIRECTIVES,  MODAL_DIRECTIVES],
    pipes: [OrderBy],
    template: `
        <div class="row">
             <div class="col-xs-12">
                <div style="position: relative; top: 10px">
                    <div>
                      <a class="btns" (click)="onAdd($event);$event.preventDefault()" href="#"><span class="fa fa-plus"></span></a>
                      <a class="btns" (click)="onRemove($event);$event.preventDefault()" [ngClass]="{disabled: !privelegesModelSelected}" href="#">
                       <span class="fa fa-remove"></span>
                      </a>
                    </div>
                </div>
                  <simpleGridTable #userSimpleGridTable>
                    <thead>
                    <tr>
                      <th sortableHeader="name" [sort]="sort">controller</th>
                      <th sortableHeader="businessId" [sort]="sort">business</th>
                      <th sortableHeader="businessId" [sort]="sort">os</th>
                      <th sortableHeader="businessId" [sort]="sort">status</th>
                      <th sortableHeader="businessId" [sort]="sort">socket</th>
                      <th sortableHeader="businessId" [sort]="sort">running</th>
                      <th sortableHeader="businessId" [sort]="sort">totalMem</th>
                      <th sortableHeader="businessId" [sort]="sort">peakMem</th>
                      <th sortableHeader="businessId" [sort]="sort">runtime</th>
                      <th sortableHeader="businessId" [sort]="sort">version</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="simpleGridRecord" [table]="stations" simpleGridRecord *ngFor="#item of m_station | OrderBy:sort.field:sort.desc; #index=index" [item]="item" [index]="index">
                      <!--<td style="width: 20%" simpleGridData (labelEdited)="onLabelEdited($event,'name')" editable="true" field="name" [item]="item"></td>-->
                      <!--<td style="width: 8%" simpleGridData field="businessId" [item]="item"></td>-->
                      <!--<td style="width: 20%" simpleGridDataChecks (changed)="setAccessMask($event)" [item]="item" [checkboxes]="getAccessMask(item)"></td>-->
                      <!--<td style="width: 12%" simpleGridData field="privilegeId" [item]="item"></td>-->
                      <!--<td style="width: 40%" simpleGridDataDropdown [testSelection]="selectedPriveleges()" (changed)="setPriveleges($event)" field="name" [item]="item" [dropdown]="m_priveleges"></td>-->
                    </tr>
                    </tbody>
                  </simpleGridTable>
             </div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StationsGrid {
    @Input()
    parts = [];
    @Input()
    partsInCart:string;

    public sort:{field:string, desc:boolean} = {field: null, desc: false};

    @Output()
    addToCart:EventEmitter<any> = new EventEmitter();
}

