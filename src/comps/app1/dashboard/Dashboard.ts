import {Component} from 'angular2/core'
import {Infobox} from "../../infobox/Infobox";
import {List, Map} from 'immutable';
import {AppStore} from "angular2-redux-util/dist/index";
import {BusinessAction} from "../../../business/BusinessAction";
import {MyChart} from "../help/contributors/MyChart";

@Component({
    directives: [Infobox, MyChart],
    selector: 'Dashboard',
    providers: [BusinessAction],
    template: `
    <div class="row">
        <br/>
        <div class="col-sm-4 col-lg-2">
            <Infobox [value1]="businessStats.lites" [value3]="'lite account'" [icon]="'fa-circle-o'">
            </Infobox>
        </div>
        <div class="col-sm-4 col-lg-2">
            <Infobox [value1]="businessStats.pros" [value3]="'pro accounts'" [icon]="'fa-circle'">
            </Infobox>
        </div>
        <div class="col-sm-4 col-lg-2">
            <Infobox [value1]="businessStats.activeAccounts" [value3]="'active accounts'" [icon]="'fa-user-plus'">
            </Infobox>
        </div>
        <div class="col-sm-4 col-lg-2">
            <Infobox [value1]="businessStats.inactiveAccounts" [value3]="'inactive accounts'" [icon]="'fa-user-times'">
            </Infobox>
        </div>
        <div class="col-sm-4 col-lg-2">
            <Infobox [value1]="businessStats.lastLogin" [value3]="'last login'" [icon]="'fa-clock-o '">
            </Infobox>
        </div>
        <div class="col-sm-4 col-lg-2">
            <Infobox [value1]="businessStats.totalBusinesses" [value3]="'total businesses'" [icon]="'fa-users'">
            </Infobox>
        </div>
    </div>  
    <div class="row">
       <div class="col-sm-12 col-lg-4">
          <MyChart [data]="data"></MyChart>
       </div>
    </div>
    `
})
export class Dashboard {
    unsub;
    businessStats = {};
    data;
    constructor(private appStore:AppStore) {
        var self = this;
        this.loadData();
        //this.data = [11.6, 198.8, 208.5, 11, 11, 11, 11, _.random(10,100)];
        this.data = [];


        appStore.sub((appdb:Map<string,any>) => {
            var serversStatus:Map<string,any> = appdb.get('serversStatus');
            if (!serversStatus)
                return;
            this.data = [];
            serversStatus.forEach((value)=>{
                self.data.push(Number(value));
            })
        }, 'appdb', false);
        
        
    }

    private loadData() {
        this.unsub = this.appStore.sub((i_businesses:Map<string,any>) => {
            this.businessStats = i_businesses.getIn(['businessStats']);
        }, 'business');
        this.businessStats = this.appStore.getState().business.getIn(['businessStats']) || {};


        // if (this.appStore.getState().business.size == 0) {
        //     this.appStore.dispatch(this.businessActions.fetchBusinesses());
        // } else {
        //     var i_businesses = this.appStore.getState().business;
        //     this.businessStats = i_businesses.getIn(['businessStats']);
        // }
        // this.unsub = this.appStore.sub((i_businesses:Map<string,any>) => {
        //     this.businessStats = i_businesses.getIn(['businessStats']);
        // }, 'business');
    }

    private ngOnDestroy() {
        this.unsub();
    }
}

