///<reference path="../../../typings/app.d.ts"/>

import {Component, ElementRef} from 'angular2/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/fromArray';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/distinctUntilChanged';
import {AppStore} from "angular2-redux-util/dist/index";
import {WhitelabelModel} from "../../reseller/WhitelabelModel";

/**
 * Logo component for Application header
 * activated via elementRef and listen to mouse events via angular
 * adapter interface
 **/
@Component({
    selector: 'logoCompany',
    template: `
            <div *ngIf="whitelabelModel" style="padding-top: 10px" > 
              <span style="color: gainsboro; font-family: Roboto">{{getBusinessInfo('companyName')}}</span>
              <img style="width: 35px" class="img-circle" src="http://galaxy.signage.me/Resources/Resellers/{{getBusinessInfo('businessId')}}/{{getBusinessInfo('fileName')}}" />
            </div>
    `
})

export class LogoCompany {

    constructor(private appStore:AppStore) {
        var i_reseller = this.appStore.getState().reseller;
        this.whitelabelModel = i_reseller.getIn(['whitelabel']);
        this.unsub = this.appStore.sub((whitelabelModel:WhitelabelModel) => {
            this.whitelabelModel = whitelabelModel;
        }, 'reseller.whitelabel');

    }

    private unsub;

    private getBusinessInfo(field):string {
        if (!this.whitelabelModel)
            return '';
        //todo: check if logo exists, if not try jpg / png / check case etc...
        // $.get(image_url)
        //     .done(function() {
        //         // Do something now you know the image exists.
        //
        //     }).fail(function() {
        //     // Image doesn't exist - do something else.
        //
        // })
        return this.appStore.getsKey('reseller', 'whitelabel', field);
    }

    private whitelabelModel:WhitelabelModel;

    private ngOnDestroy() {
        this.unsub();
    }


}