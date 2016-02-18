import {Component, ChangeDetectionStrategy, Input} from "angular2/core";
import {SortableHeader} from "./SortableHeader";
import {FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators, AbstractControl, Control} from 'angular2/common'
import {COMMON_DIRECTIVES} from "angular2/common";
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/distinctUntilChanged';
import {OrderBy} from "../../pipes/OrderBy";

@Component({
    selector: 'SimpleGrid',
    //changeDetection: ChangeDetectionStrategy.OnPushObserve,
    pipes: [OrderBy],
    directives: [COMMON_DIRECTIVES],
    styles: [`input {margin: 20px; width: 50%}`],
    template: `
    <table class="table">
    <ng-content></ng-content>
      <tbody>
      <!-- no need to subscribe to observable since async does this for us -->
        <tr *ngFor="#item of list | OrderBy:sort.field:sort.desc">
          <td>{{ item }}</td>
          <td><img src="{{ item.iconPath }}" style="width: 40px; height: 40px"/></td>
          <td>{{ item }}</td>
          <td>{{ item }}</td>
          <!-- <td [innerHtml]="item.day"></td> -->
        </tr>
      </tbody>
    </table>
  `,
})

export class SimpleGrid {
    //private weatherItems:any = [1,2,3,4,5];
    private zipControl:Control = new Control();

    // the real magic here is that the sort variable is being used in several places
    // including here to set the pipe sorting, in the SortableHeader component to show and hide
    // the header icons, as well as in SortableHeader to change the sort order on header clicks.
    // So we pass the SAME sort var to all SortableHeader directives and all work with it
    // in both displaying and the sorting mechanics
    //public sort:{field: string, desc: boolean} = {field: null, desc: false};

    @Input()
    sort;

    @Input()
    list;


    constructor() {
        this.listenWeatherInput();
        //this.commBroker.getService(Consts.Services().Properties).setPropView('Weather');
    }

    ngAfterViewInit() {
        this.zipControl.updateValue('91301');
    }

    listenWeatherInput() {
        // return this.weatherItems = this.zipControl.valueChanges
        //     .debounceTime(400)
        //     .distinctUntilChanged()
        //     .filter((zip:string)=> {
        //         return zip.length > 3;
        //         // switchMap is really cool as it will both flatMap our Observables
        //         // as well as it unsubscribes from all previous / pending calls to server and only
        //         // listen to to newly created Observable
        //     }).switchMap(zip => {
        //         return this.weatherService.search(`${zip}/1`)
        //     })
    }
}
