///<reference path="../../../typings/app.d.ts"/>

import {Component, ChangeDetectionStrategy, ChangeDetectorRef} from 'angular2/core';
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
    changeDetection: ChangeDetectionStrategy.Default,
    template: `
            <div *ngIf="whitelabelModel" style="padding-top: 7px" > 
              <span style="color: gainsboro; font-family: Roboto">{{getBusinessInfo('companyName')}}</span>
              <!--<img style="width: 35px" class="img-circle" src="http://galaxy.signage.me/Resources/Resellers/{{getBusinessInfo('businessId')}}/{{getBusinessInfo('fileName')}}" />-->
              <img style="width: 35px" class="img-circle" [src]="getImageUrl()" (load)="onImageLoaded()" (error)="onImageError()" />
            </div>
    `
})

export class LogoCompany {

    constructor(private appStore:AppStore, private cdr:ChangeDetectorRef) {
        var i_reseller = this.appStore.getState().reseller;
        this.whitelabelModel = i_reseller.getIn(['whitelabel']);
        this.unsub = this.appStore.sub((whitelabelModel:WhitelabelModel) => {
            this.whitelabelModel = whitelabelModel;
        }, 'reseller.whitelabel');
    }

    private imageRetries:number = 0;
    private unsub;

    private getImageUrl() {
        if (!this.whitelabelModel)
            return '';
        var url = '';
        switch (this.imageRetries){
            case 0: {
                url = 'http://galaxy.signage.me/Resources/Resellers/' + this.getBusinessInfo('businessId') + '/Logo.jpg'
                break;
            }
            case 1: {
                url = 'http://galaxy.signage.me/Resources/Resellers/' + this.getBusinessInfo('businessId') + '/Logo.png'
                break;
            }
            default: {
                url = 'assets/person.png'
                break;
            }

        }
        return url;
    }

    private onImageLoaded() {
        this.cdr.detach();
    }

    private onImageError() {
        this.imageRetries++;
    }

    private getBusinessInfo(field):string {
        if (!this.whitelabelModel)
            return '';
        return this.appStore.getsKey('reseller', 'whitelabel', field);
    }

    private whitelabelModel:WhitelabelModel;

    private ngOnDestroy() {
        this.unsub();
    }


}