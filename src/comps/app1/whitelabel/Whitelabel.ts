import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from 'angular2/core'
import {CanActivate, ComponentInstruction} from "angular2/router";
import {AuthService} from "../../../services/AuthService";
import {appInjService} from "../../../services/AppInjService";
import {Tab} from "../../tabs/tab";
import {Tabs} from "../../tabs/tabs";
import {WhitelabelModel} from "../../../reseller/WhitelabelModel";
import {ResellerAction} from "../../../reseller/ResellerAction";
import {AppStore} from "angular2-redux-util/dist/index";
import {FORM_DIRECTIVES, ControlGroup, FormBuilder, AbstractControl, Validators, Control} from "angular2/common";
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
            this.updateForm();
        }, 'reseller.whitelabel');

        this.whitelabelForm = fb.group({
            'companyName': [''],
            'logoTooltip': [''],
            'logoLink': [''],
            'createAccountOption': ['']
        });
        this.companyName = this.whitelabelForm.controls['companyName'] as Control;
        this.logoTooltip = this.whitelabelForm.controls['logoTooltip'] as Control;
        this.logoLink = this.whitelabelForm.controls['logoLink'] as Control;
        this.createAccountOption = this.whitelabelForm.controls['createAccountOption'] as Control;
        this.updateForm();
    }

    private onChange(event){
        setTimeout(()=>this.appStore.dispatch(this.resellerAction.updateResellerInfo(this.whitelabelForm.value)),1);
    }

    private updateForm() {
        this.companyName.updateValue(this.whitelabelModel.getKey('companyName'));
        this.logoLink.updateValue(this.whitelabelModel.getKey('logoLink'));
        this.logoTooltip.updateValue(this.whitelabelModel.getKey('logoTooltip'));
        this.createAccountOption.updateValue(this.whitelabelModel.getKey('createAccountOption'));
    };

    private whitelabelForm:ControlGroup;
    private whitelabelModel:WhitelabelModel;
    private unsub;

    private companyName:Control;
    private logoTooltip:Control;
    private logoLink:Control;
    private createAccountOption:Control;


    private ngOnDestroy() {
        this.unsub();
    }
}


// _.forEach(this.whitelabelForm.controls,(control:Control)=>{
//     if (control.touched){
//         console.log(control);
//     }
// })

// if (!this.whitelabelForm.pristine){
//     this.whitelabelForm._pristine = true;
//     this.appStore.dispatch(this.resellerAction.updateResellerInfo(changes))
// }
// this.form['_touched'] = false;
// StringMapWrapper.forEach(this.form.controls, (control: AbstractControl, name: string) => {
//     control['_touched'] = false;
// });

// private listenFormChanges() {
//     this.whitelabelForm.valueChanges.debounceTime(1000).subscribe((changes:any) => {
//     });
// }
// this.listenFormChanges();