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
            this.updateForm();
        }, 'reseller.whitelabel');

        this.whitelabelForm = fb.group({
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

        this.whitelabelEnabled = this.whitelabelForm.controls['whitelabelEnabled'] as Control;
        this.companyName = this.whitelabelForm.controls['companyName'] as Control;
        this.logoTooltip = this.whitelabelForm.controls['logoTooltip'] as Control;
        this.logoLink = this.whitelabelForm.controls['logoLink'] as Control;
        this.createAccountOption = this.whitelabelForm.controls['createAccountOption'] as Control;
        this.linksHome = this.whitelabelForm.controls['linksHome'] as Control;
        this.linksDownload = this.whitelabelForm.controls['linksDownload'] as Control;
        this.linksContact = this.whitelabelForm.controls['linksContact'] as Control;
        this.twitterShow = this.whitelabelForm.controls['twitterShow'] as Control;
        this.twitterLink = this.whitelabelForm.controls['twitterLink'] as Control;
        this.chatShow = this.whitelabelForm.controls['chatShow'] as Control;
        this.chatLink = this.whitelabelForm.controls['chatLink'] as Control;
        this.mainMenuLink0 = this.whitelabelForm.controls['mainMenuLink0'] as Control;
        this.mainMenuLink1 = this.whitelabelForm.controls['mainMenuLink1'] as Control;
        this.mainMenuLink2 = this.whitelabelForm.controls['mainMenuLink2'] as Control;
        this.mainMenuLink3 = this.whitelabelForm.controls['mainMenuLink3'] as Control;
        this.mainMenuLabel4 = this.whitelabelForm.controls['mainMenuLabel4'] as Control;
        this.bannerEmbedReference = this.whitelabelForm.controls['bannerEmbedReference'] as Control;

        this.updateForm();
    }

    private onChange(event) {
        setTimeout(()=>this.appStore.dispatch(this.resellerAction.updateResellerInfo(this.whitelabelForm.value)), 1);
    }

    private updateForm() {
        this.whitelabelEnabled.updateValue(this.whitelabelModel.getKey('whitelabelEnabled'));
        this.companyName.updateValue(this.whitelabelModel.getKey('companyName'));
        this.logoLink.updateValue(this.whitelabelModel.getKey('logoLink'));
        this.logoTooltip.updateValue(this.whitelabelModel.getKey('logoTooltip'));
        this.createAccountOption.updateValue(this.whitelabelModel.getKey('createAccountOption'));
        this.linksHome.updateValue(this.whitelabelModel.getKey('linksHome'));
        this.linksDownload.updateValue(this.whitelabelModel.getKey('linksDownload'));
        this.linksContact.updateValue(this.whitelabelModel.getKey('linksContact'));
        this.twitterShow.updateValue(this.whitelabelModel.getKey('twitterShow'));
        this.twitterLink.updateValue(this.whitelabelModel.getKey('twitterLink'));
        this.chatShow.updateValue(this.whitelabelModel.getKey('chatShow'));
        this.chatLink.updateValue(this.whitelabelModel.getKey('chatLink'));
        this.bannerEmbedReference.updateValue(this.whitelabelModel.getKey('bannerEmbedReference'));
        this.mainMenuLink0.updateValue(this.whitelabelModel.getKey('mainMenuLink0'));
        this.mainMenuLink1.updateValue(this.whitelabelModel.getKey('mainMenuLink1'));
        this.mainMenuLink2.updateValue(this.whitelabelModel.getKey('mainMenuLink2'));
        this.mainMenuLink3.updateValue(this.whitelabelModel.getKey('mainMenuLink3'));
        this.mainMenuLabel4.updateValue(this.whitelabelModel.getKey('mainMenuLabel4'));

    };

    private whitelabelForm:ControlGroup;
    private whitelabelModel:WhitelabelModel;
    private unsub;
    private whitelabelEnabled:Control;
    private companyName:Control;
    private logoTooltip:Control;
    private logoLink:Control;
    private createAccountOption:Control;
    private linksHome:Control;
    private linksDownload:Control;
    private linksContact:Control;
    private twitterShow:Control;
    private twitterLink:Control;
    private chatShow:Control;
    private chatLink:Control;
    private mainMenuLink0:Control;
    private mainMenuLink1:Control;
    private mainMenuLink2:Control;
    private mainMenuLink3:Control;
    private mainMenuLabel4:Control;
    private bannerEmbedReference:Control;

    private get isWhitelabelEnabled():boolean {
        if (!this.whitelabelModel)
            return false;
        return this.whitelabelModel.getKey('whitelabelEnabled')
    }

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