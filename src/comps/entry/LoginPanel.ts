///<reference path="../../../typings/app.d.ts" />

import {Component, Injectable} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {RouterLink} from 'angular2/router';
import {Router} from "angular2/router";
import {AppStore} from "angular2-redux-util";
import {BusinessAction} from "../../business/BusinessAction";
import Map = Immutable.Map;
import {LocalStorage} from "../../services/LocalStorage";
import {AuthService, FlagsAuth} from "../../services/AuthService";
var bootbox = require('bootbox');

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
               `
})
export class LoginPanel {
    private m_user:string;
    private m_pass:string;
    private m_router:Router;
    private m_rememberMe:any;
    private m_unsub:()=>void;
    private showLoginPanel:boolean = false;

    constructor(private appStore:AppStore, private router:Router, private authService:AuthService) {
        this.m_router = router;
        this.m_user = '';
        this.m_pass = '';
        this.m_rememberMe = this.authService.getLocalstoreCred().r;

        this.m_unsub = appStore.sub((credentials:Map<string,any>) => {
            var status = credentials.get('authenticated');
            var reason = credentials.get('reason');
            if (status) {
                this.onAuthPass();
            } else {
                this.onAuthFail(reason);
            }
        }, 'appdb.credentials', false);

        if (this.authService.getLocalstoreCred().u != '') {
            this.showLoginPanel = false;
            this.authService.authUser();
        } else {
            this.showLoginPanel = true;
        }
    }

    private authUser() {
        this.authService.authUser(this.m_user, this.m_pass, this.m_rememberMe);
    }

    private onAuthPass() {
        this.m_router.navigate(['/App1']);
    }

    private onAuthFail(i_reason) {
        let msg1:string;
        let msg2:string;
        switch (i_reason){
            case FlagsAuth.WrongPass: {
                msg1 = 'User or password are incorrect...'
                msg2 = 'Please try again or click forgot password to reset your credentials'
                break;
            }
            case FlagsAuth.NotEnterprise: {
                msg1 = 'Not an enterprise account'
                msg2 = 'You must login with an Enterprise account, not an end user account...'
                break;
            }
        }
        setTimeout(()=> {
            bootbox.dialog({
                closeButton: true,
                title: msg1,
                message: msg2
            });
        }, 1200);
        return false;
    }

    ngOnDestroy() {
        this.m_unsub();
    }
}


