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
    providers: [BusinessAction],
    template: `
                <MyChart></MyChart>
                <div id="appLogin" style="">
                  <form class="form-signin" role="form">
                    <h2 class="form-signin-heading"></h2>
                    <input #userName id="userName" type="text" value="{{user}}" class="form-control" data-localize="username" placeholder="Type anything" required autofocus>
                    <input #userPass id="userPass" type="password" value="{{pass}}" class="form-control" data-localize="password" placeholder="Type anything" required>
                    <label class="checkbox">
                      <input id="rememberMe" type="checkbox" checked value="remember-me">
                      <span> Remember me </span></label>
                    <button id="loginButton" (click)="authUser(userName.value, userPass.value)" class="btn btn-lg btn-primary btn-block" type="submit">
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
                <small>I am Login component and I am inside EntryPanel</small>`
})
export class LoginPanel {
    private m_user:string;
    private m_pass:string;
    private m_myRouter:Router;
    ubsub;

    constructor(private appStore:AppStore, router:Router, private appdbAction:AppdbAction) {
        this.m_myRouter = router;
        this.m_user = '';
        this.m_pass = '';

        this.ubsub = appStore.sub((appdb:Map<string,any>) => {
            var status = appdb.get('credentials').get('authenticated');
            var user = appdb.get('credentials').get('user');
            var pass = appdb.get('credentials').get('pass');
            if (status)
                this.onLogin();
        }, 'appdb', false);

    }

    private authUser(i_user:string, i_pass:string) {
        var self = this;
        bootbox.dialog({
            closeButton: false,
            title: "Please wait, Authenticating...",
            message: " "
        });

        this.appdbAction.createDispatcher(this.appdbAction.authenticateUser)(i_user, i_pass);
    }

    private onLogin() {
        this.m_myRouter.navigate(['/AppManager']);
        bootbox.hideAll();
        //event.preventDefault();
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


