///<reference path="../../../typings/app.d.ts" />

import {Component, Injectable} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {RouterLink} from 'angular2/router';
import {Router} from "angular2/router";
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/bufferCount';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/range';
import {AppStore} from "angular2-redux-util";
import {BusinessAction} from "../../business/BusinessAction";
import {AppdbAction} from "../../appdb/AppdbAction";
import Map = Immutable.Map;
import {LocalStorage} from "../../services/LocalStorage";

// import {Subject} from "rxjs/Subject";
// import {BehaviorSubject} from "rxjs/subject/BehaviorSubject";
// import {Observable} from "rxjs/Observable";

var bootbox = require('bootbox');

export class User {
    public id:string;
    public name:string;
    public pass:string;
    public gender:string;

    constructor(obj?:any) {
        this.id = obj && obj.id || Math.random();
        this.name = obj && obj.name || 'anonymous';
        this.pass = obj && obj.pass || '';
        this.gender = obj && obj.gender || 'male';
    }
}

@Injectable()
@Component({
    selector: 'LoginPanel',
    directives: [ROUTER_DIRECTIVES, RouterLink],
    providers: [BusinessAction, LocalStorage],
    template: `
                <div *ngIf="showLoginPanel" id="appLogin">
                  <form class="form-signin" role="form">
                    <h2 class="form-signin-heading"></h2>
                    <input #userName id="userName" type="text" [(ngModel)]="m_user" class="form-control" data-localize="username" placeholder="Type anything" required autofocus>
                    <input #userPass id="userPass" type="password" [(ngModel)]="m_pass" class="form-control" data-localize="password" placeholder="Type anything" required>
                    <label class="checkbox" style="padding-left: 20px">
                      <input #rememberMe type="checkbox" [checked]="m_rememberMe" (change)="m_rememberMe = rememberMe.checked" />
                      <span> Remember me </span>
                    </label>
                    <button id="loginButton" (click)="authUser()" class="btn btn-lg btn-primary btn-block" type="submit">
                      Sign in
                    </button>
                    <hr class="hrThin"/>
                    <a [routerLink]="['/ForgotPass', 'ForgotPass']">Forgot password</a>
                    <div id="languageSelectionLogin"></div>
                  </form>
                </div>
                <!-- <a [routerLink]="['/EntryPanelNoId', {id: 123}, 'Route4']">To forgot pass</a> -->
                <!-- <a [routerLink]="['/App1']">Direct to App1</a><br/> -->
                <!-- <a [routerLink]="['/App2']">Direct to App2</a><br/> -->
               `
})
export class LoginPanel {
    private m_user:string;
    private m_pass:string;
    private m_myRouter:Router;
    private m_rememberMe;
    private ubsub;
    private showLoginPanel:boolean = false;

    constructor(private appStore:AppStore, router:Router, private appdbAction:AppdbAction, private localStorage:LocalStorage) {
        this.m_myRouter = router;
        this.m_user = '';
        this.m_pass = '';
        this.m_rememberMe = 'checked';

        this.ubsub = appStore.sub((credentials:Map<string,any>) => {
            var status = credentials.get('authenticated');
            var user = credentials.get('user');
            var pass = credentials.get('pass');
            if (status) {
                this.onAuthPass();
            } else {
                this.onAuthFail();
            }
        }, 'appdb.credentials', false);
        this.autoLogin();
    }

    private autoLogin() {
        var credentials = this.localStorage.getItem('remember_me');
        if (!credentials || (credentials && credentials.u == '')){
            this.showLoginPanel = true;
            if (credentials){
                this.m_rememberMe = credentials.u;
            }
            return;
        }
        this.m_user = credentials.u;
        this.m_pass = credentials.p;
        this.authUser();
    }

    private authUser() {
        bootbox.dialog({
            closeButton: false,
            title: "Please wait, Authenticating...",
            message: " "
        });
        this.appdbAction.createDispatcher(this.appdbAction.authenticateUser)(this.m_user, this.m_pass);
    }

    private onAuthPass() {
        this.m_myRouter.navigate(['/App1']);
        bootbox.hideAll();
        if (this.m_rememberMe) {
            this.localStorage.setItem('remember_me', {
                u: this.m_user,
                p: this.m_pass,
                r: this.m_rememberMe
            });
        } else {
            this.localStorage.setItem('remember_me', {
                u: '',
                p: '',
                r: this.m_rememberMe
            });
        }
        return false;
    }

    private onAuthFail() {
        this.showLoginPanel = true;
        setTimeout(()=> {
            bootbox.hideAll();
        }, 1000);
        setTimeout(()=> {
            bootbox.dialog({
                closeButton: true,
                title: "User or password are incorrect...",
                message: "Please try again or click forgot password to reset your credentials"
            });
        }, 1200);
        return false;
    }

    public set loginName(name:string) {
        this.m_user = name;
    }

    toString() {
    }

    ngOnDestroy() {
        this.ubsub();
    }
}


