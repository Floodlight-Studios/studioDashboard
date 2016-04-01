import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from 'angular2/core'
import {CanActivate, ComponentInstruction} from "angular2/router";
import {AuthService} from "../../../services/AuthService";
import {appInjService} from "../../../services/AppInjService";
import {Tab} from "../../tabs/tab";
import {Tabs} from "../../tabs/tabs";
import {WhitelabelModel} from "../../../reseller/WhitelabelModel";
import {ResellerAction} from "../../../reseller/ResellerAction";
import {AppStore} from "angular2-redux-util/dist/index";
import {FORM_DIRECTIVES, ControlGroup, FormBuilder, Control} from "angular2/common";
const _ = require('underscore');

@Component({
    selector: 'whitelabel',
    directives: [Tab, Tabs, FORM_DIRECTIVES],
    templateUrl: '/src/comps/app1/whitelabel/Whitelabel.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
@CanActivate((to:ComponentInstruction, from:ComponentInstruction) => {
    let authService:AuthService = appInjService().get(AuthService);
    return authService.checkAccess(to, from, ['/Login/Login']);
})
export class Whitelabel {

    constructor(private appStore:AppStore, private fb:FormBuilder, private resellerAction:ResellerAction) {
        var i_reseller = this.appStore.getState().reseller;

        this.whitelabelModel = i_reseller.getIn(['whitelabel']);
        this.unsub = this.appStore.sub((whitelabelModel:WhitelabelModel) => {
            this.whitelabelModel = whitelabelModel;
            this.renderFormInputs();
        }, 'reseller.whitelabel');

        this.contGroup = fb.group({
            'whitelabelEnabled': [''],
            'companyName': [''],
            'logoTooltip': [''],
            'logoLink': [''],
            'linksHome': [''],
            'linksDownload': [''],
            'linksContact': [''],
            'twitterLink': [''],
            'twitterShow': [''],
            'chatShow': [''],
            'chatLink': [''],
            'mainMenuLink0': [''],
            'mainMenuLink1': [''],
            'mainMenuLink2': [''],
            'mainMenuLink3': [''],
            'mainMenuLabel4': [''],
            'bannerEmbedReference': [''],
            'createAccountOption': ['']
        });
        _.forEach(this.contGroup.controls,(value,key:string)=>{
            this.formInputs[key] = this.contGroup.controls[key] as Control;
        })
        this.renderFormInputs();
    }

    private onChange(event) {
        setTimeout(()=>this.appStore.dispatch(this.resellerAction.updateResellerInfo(this.contGroup.value)), 1);
    }

    private renderFormInputs() {
        _.forEach(this.formInputs,(value,key:string)=>{
            var value = this.whitelabelModel.getKey(key);
            this.formInputs[key].updateValue(value);
        })
    };

    private formInputs = {};
    private contGroup:ControlGroup;
    private whitelabelModel:WhitelabelModel;
    private unsub;

    private get isWhitelabelEnabled():boolean {
        if (!this.whitelabelModel)
            return false;
        return this.whitelabelModel.getKey('whitelabelEnabled')
    }

    private ngOnDestroy() {
        this.unsub();
    }
}