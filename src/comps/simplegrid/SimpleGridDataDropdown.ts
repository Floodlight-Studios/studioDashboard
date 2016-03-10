import {
    Component, Input, ChangeDetectionStrategy, Output, EventEmitter, ViewChildren, QueryList, HostListener
} from 'angular2/core'
import {List} from "immutable";
import {StoreModel} from "../../models/StoreModel";

@Component({
    selector: 'td[simpleGridDataDropdown]',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
        i {
            cursor: pointer;
        }
        .dropdown-submenu {
            position: relative;
        }
        .dropdown-submenu>.dropdown-menu {
            top: 0;
            left: 100%;
            margin-top: -6px;
            margin-left: -1px;
            -webkit-border-radius: 0 6px 6px 6px;
            -moz-border-radius: 0 6px 6px;
            border-radius: 0 6px 6px 6px;
        }
        .dropdown-submenu:hover>.dropdown-menu {
            display: block;
        }
        .dropdown-submenu>a:after {
            display: block;
            content: " ";
            float: right;
            width: 0;
            height: 0;
            border-color: transparent;
            border-style: solid;
            border-width: 5px 0 5px 5px;
            border-left-color: #ccc;
            margin-top: 5px;
            margin-right: -10px;
        }
        .dropdown-submenu:hover>a:after {
            border-left-color: #fff;
        }
        .dropdown-submenu.pull-left {
            float: none;
        }
        .dropdown-submenu.pull-left>.dropdown-menu {
            left: -100%;
            margin-left: 10px;
            -webkit-border-radius: 6px 0 6px 6px;
            -moz-border-radius: 6px 0 6px 6px;
            border-radius: 6px 0 6px 6px;
        }
    `],
    template: `   
                <div class="dropdown center-block" style="">
                    <a id="dLabel" role="button" data-toggle="dropdown" class="btn btn-mini btn-primary" data-target="#" href="/page.html">
                        Dropdown <span class="caret"></span>
                    </a>
                    <ul class="dropdown-menu multi-level" role="menu" aria-labelledby="dropdownMenu">
                      <li><a href="#">Some action</a></li>
                      <li><a href="#">Some other action</a></li>
                      <li class="divider"></li>
                      <li class="dropdown-submenu">
                        <a tabindex="-1" href="#">Hover me for more options</a>
                        <ul class="dropdown-menu">
                          <li><a tabindex="-1" href="#">Second level</a></li>
                          <li class="dropdown-submenu">
                            <a href="#">Even More..</a>
                            <ul class="dropdown-menu">
                                <li><a href="#">3rd level</a></li>
                                <li><a href="#">3rd level</a></li>
                            </ul>
                          </li>
                          <li><a href="#">Second level</a></li>
                          <li><a href="#">Second level</a></li>
                        </ul>
                      </li>
                    </ul>
                </div>
        <!--<div *ngFor="#item of m_checkboxes">-->
          <!--<label class="pull-left">{{item.name}}</label>-->
          <!--<Input #checkInputs type="checkbox" [checked]="item.checked" value="{{item.value}}" class="pull-left" style="margin-right: 2px">-->
        <!--</div>-->
    `
})
export class SimpleGridDataDropdown {

    private m_checkboxes:List<any>
    private m_storeModel:StoreModel;

    @ViewChildren('checkInputs')
    inputs:QueryList<any>

    @Input()
    set checkboxes(i_checkboxes:List<any>) {
        this.m_checkboxes = i_checkboxes
    }

    @Input()
    set item(i_storeModel:StoreModel) {
        this.m_storeModel = i_storeModel
    }

    @Output()
    changed:EventEmitter<any> = new EventEmitter();

    @HostListener('click', ['$event'])
    onClick(e) {
        let values = []
        this.inputs.map(v=> {
            values.push(v.nativeElement.checked);
        });
        this.changed.next({item: this.m_storeModel, value: values});
        return true;
    }
}

