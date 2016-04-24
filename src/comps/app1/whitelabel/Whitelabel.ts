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

    private loadNow() {
        var progressHandlingFunction = (e) => {
            console.log('progress ' + e);
        }
        var f = this.fileName.nativeElement.value;
        var form:any = jQuery('form')[0];
        var formData:any = new FormData(form);
        // formData.append("filename", f);
        formData.append("filename", "Logo.jpg");
        formData.append("file", f);
        formData.append("userName", "reseller@ms.com");
        formData.append("password", "123123");

        jQuery.ajaxSetup({
            cache: false,
            timeout: 8000,
            crossDomain: true
        });
        jQuery.ajax({
            url: 'http://galaxy.mediasignage.com/WebService/ResourceUpload.ashx',  //Server script to process data
            type: 'POST',
            xhr: function () {  // Custom XMLHttpRequest
                var myXhr = jQuery.ajaxSettings.xhr();
                if (myXhr.upload) { // Check if upload property exists
                    myXhr.upload.addEventListener('progress', progressHandlingFunction, false); // For handling the progress of the upload
                }
                return myXhr;
            },
            //Ajax events
            // beforeSend: function (e) {
            //     alert('before ' + e)
            // },
            success: function (e) {
                alert('success ' + e)
            },
            error: function (e) {
                alert('error ' + e)
            },
            // Form data
            data: formData,
            //Options to tell jQuery not to process data or worry about content-type.
            cache: false,
            contentType: false,
            processData: false,
            crossDomain: true
        });

        // alert('loading');
        // var httpRequest = new XMLHttpRequest();
        // httpRequest.onload = function (oEvent) {
        //     if (httpRequest.status == 200) {
        //         alert('finish');
        //     }
        // };
        // var formData = new FormData();
        // formData.append("filename", "Logo.jpg");
        // var f = jQuery('#elemetFile');
        // // formData.append("file", elemetFile.file);
        // formData.append("file", f);
        // formData.append("userName", "reseller@ms.com");
        // formData.append("password", "123213");
        // httpRequest.open("POST", "https://galaxy.mediasignage.com/WebService/ResourceUpload.ashx");
        // httpRequest.send(formData);
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