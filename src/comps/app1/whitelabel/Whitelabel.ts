import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from 'angular2/core'
import {CanActivate, ComponentInstruction} from "angular2/router";
import {AuthService} from "../../../services/AuthService";
import {appInjService} from "../../../services/AppInjService";
import {Tab} from "../../tabs/tab";
import {Tabs} from "../../tabs/tabs";
import {WhitelabelModel} from "../../../reseller/WhitelabelModel";
import {ResellerAction} from "../../../reseller/ResellerAction";
import {AppStore} from "angular2-redux-util/dist/index";
import {FORM_DIRECTIVES, ControlGroup, FormBuilder, AbstractControl, Validators} from "angular2/common";

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
        }, 'reseller.whitelabel');

        this.whitelabelForm = fb.group({
            'companyName': ['', Validators.required],
            'logoTooltip': ['', Validators.required],
            'logoLink': ['', Validators.required],
            'createAccountOption': ['', Validators.required]
        });

        this.whitelabelForm.valueChanges.debounceTime(1500).subscribe(
            (value:string) => {
                console.log('name changed, notified via observable: ', value);
            }
        );
    }

    private whitelabelForm:ControlGroup;
    private whitelabelModel:WhitelabelModel;
    private unsub;

    // private companyName:AbstractControl;
    // private logoTooltip:AbstractControl;
    // this.companyName = this.whitelabelForm.controls['companyName'];
    // this.logoTooltip = this.whitelabelForm.controls['logoTooltip'];

    private ngOnDestroy() {
        this.unsub();
    }
}

