import {Component, ViewChild, ChangeDetectionStrategy, ElementRef, NgZone} from 'angular2/core'
import {Router} from 'angular2/router';
import {CanActivate, ComponentInstruction} from "angular2/router";
import {AuthService} from "../../../services/AuthService";
import {appInjService} from "../../../services/AppInjService";
import {Tab} from "../../tabs/tab";
import {Tabs} from "../../tabs/tabs";
import {WhitelabelModel} from "../../../reseller/WhitelabelModel";
import {ResellerAction} from "../../../reseller/ResellerAction";
import {AppStore} from "angular2-redux-util/dist/index";
import {FORM_DIRECTIVES, ControlGroup, FormBuilder, Control} from "angular2/common";
import {BlurForwarder} from "../../blurforwarder/BlurForwarder";
import {Loading} from "../../loading/Loading";
import {Lib} from "../../../Lib";
const _ = require('underscore');
const bootbox = require('bootbox');

@Component({
    selector: 'whitelabel',
    styleUrls: [`../comps/app1/whitelabel/Whitelabel.css`],
    directives: [Tab, Tabs, FORM_DIRECTIVES, BlurForwarder, Loading],
    host: {
        '(input-blur)': 'onInputBlur($event)'
    },
    templateUrl: '/src/comps/app1/whitelabel/Whitelabel.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
@CanActivate((to:ComponentInstruction, from:ComponentInstruction) => {
    let authService:AuthService = appInjService().get(AuthService);
    return authService.checkAccess(to, from, ['/Login/Login']);
})
export class Whitelabel {

    constructor(private appStore:AppStore, private fb:FormBuilder, private router:Router, private zone:NgZone, private resellerAction:ResellerAction) {
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
        _.forEach(this.contGroup.controls, (value, key:string)=> {
            this.formInputs[key] = this.contGroup.controls[key] as Control;
        })
        this.renderFormInputs();
    }

    @ViewChild('fileName') fileName:ElementRef;

    private whiteLabelEnabled:any = true;
    private formInputs = {};
    private contGroup:ControlGroup;
    private whitelabelModel:WhitelabelModel;
    private unsub;

    private onInputBlur(event) {
        setTimeout(()=>this.appStore.dispatch(this.resellerAction.saveWhiteLabel(Lib.CleanCharForXml(this.contGroup.value))), 1);
    }

    private uploadLogos(i_type) {
        var progressHandlingFunction = (e) => {
            console.log('progress ' + e);
        }
        var httpRequest = new XMLHttpRequest();
        httpRequest.onload = function (oEvent) {
            if (httpRequest.status == 200) {
                if (httpRequest.response == 'true') {
                    bootbox.alert('File uploaded successfully...');
                } else {
                    bootbox.alert('There was a problem uploading your file');
                }
            }
        };
        var formData = new FormData();
        var fileName, file, fileExtension;
        if (i_type == 'logo') {
            file = document.getElementById("elementFile")['files'][0];
            fileName = document.getElementById("elementFile")['files'][0]['name'];
            fileExtension = fileName.substr((fileName.lastIndexOf('.') + 1))
            if (!(/(jpg|png)$/i).test(fileExtension)) {
                bootbox.alert('File extension must be .png or .jpg')
                return
            }
            fileName = `Logo.${fileExtension}`;
        }
        if (i_type == 'splash') {
            file = document.getElementById("elementFile2")['files'][0];
            fileName = document.getElementById("elementFile2")['files'][0]['name'];
            fileExtension = fileName.substr((fileName.lastIndexOf('.') + 1))
            // if (!(/(swf)$/i).test(fileExtension)) {
            //     bootbox.alert('File type must be Flash and extension to be .swf')
            //     return
            // }
            fileName = `Update.swf`;
        }
        formData.append("filename", fileName);

        formData.append("file", file);
        var user = this.appStore.getState().appdb.get('credentials').get('user');
        var pass = this.appStore.getState().appdb.get('credentials').get('pass');
        formData.append("userName", user);
        formData.append("password", pass);
        var appdb:Map<string,any> = this.appStore.getState().appdb;
        var url = appdb.get('appBaseUrlUser').split('ResellerService')[0];
        httpRequest.open("POST", `${url}/ResourceUpload.ashx`);
        httpRequest.send(formData);
    }

    private onBranding(value) {
        switch (value) {
            case 'video':
            {
                window.open('http://www.digitalsignage.com/_html/video_tutorials.html?videoNumber=msgetstarted', '_blank');
                break;
            }
            case 'git':
            {
                window.open('https://github.com/born2net/msgetstarted', '_blank');
                break;
            }
            case 'solution':
            {
                bootbox.alert('At this point you can have your customers open accounts directly on your web site, track them and up-sale them... we make it easy for you to be successful in Digital Signage!');
                break;
            }
        }
        return false;
    }

    private renderFormInputs() {
        this.whiteLabelEnabled = this.whitelabelModel.getKey('whitelabelEnabled');
        this.whiteLabelEnabled = Lib.BooleanToNumber(this.whiteLabelEnabled);

        _.forEach(this.formInputs, (value, key:string)=> {
            var value = this.whitelabelModel.getKey(key);
            value = Lib.BooleanToNumber(value);
            this.formInputs[key].updateValue(value);
        })
    };

    private onWhiteLabelChange(value) {
        setTimeout(()=>this.appStore.dispatch(this.resellerAction.saveWhiteLabel({whitelabelEnabled: value})), 1)
    }

    private ngOnDestroy() {
        this.unsub();
    }
}