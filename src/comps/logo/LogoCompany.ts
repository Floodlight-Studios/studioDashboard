import {Component, ChangeDetectionStrategy, ChangeDetectorRef} from 'angular2/core';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/fromArray';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/distinctUntilChanged';
import {AppStore} from "angular2-redux-util/dist/index";
import {WhitelabelModel} from "../../reseller/WhitelabelModel";
import {ImgLoader} from "../imgloader/ImgLoader";

/**
 * Logo component for Application header
 * activated via elementRef and listen to mouse events via angular
 * adapter interface
 **/
@Component({
    selector: 'logoCompany',
    directives: [ImgLoader],
    changeDetection: ChangeDetectionStrategy.Default,
    template: `
            <div *ngIf="whitelabelModel"> 
              <span style="color: gainsboro; font-family: Roboto">{{getBusinessInfo('companyName')}}</span>
              <imgLoader style="display: inline-block; padding-top: 4px" [style]="stylesObj" [circle]="true" [images]="getImageUrl()" [defaultImage]="'assets/person.png'"></imgLoader>
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

        this.stylesObj = {
            img: {
                'color': '#333333',
                'overflow': 'hidden',
                'white-space': 'nowrap',
                'width': '35px'
            }
        }
    }
    private unsub;
    private stylesObj;
    private images:Array<string> = [];
    private whitelabelModel:WhitelabelModel;

    private getImageUrl():Array<string> {
        if (!this.whitelabelModel)
            return [];
        if (this.images.length > 0)
            return this.images;
        this.images.push('http://galaxy.signage.me/Resources/Resellers/' + this.getBusinessInfo('businessId') + '/Logo.jpg')
        this.images.push('http://galaxy.signage.me/Resources/Resellers/' + this.getBusinessInfo('businessId') + '/Logo.png')
        return this.images;
    }

    private getBusinessInfo(field):string {
        if (!this.whitelabelModel)
            return '';
        return this.appStore.getsKey('reseller', 'whitelabel', field);
    }

    private ngOnDestroy() {
        this.unsub();
    }
}