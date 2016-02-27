import {Injectable} from 'angular2/core';
import {Router} from "angular2/router";
import {AppStore} from "angular2-redux-util";
import Map = Immutable.Map;
import {LocalStorage} from "./LocalStorage";
import {StoreService} from "./StoreService";
import {AppdbAction} from "../appdb/AppdbAction";

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
export class LoginService {
    private m_user:string;
    private m_pass:string;
    private m_myRouter:Router;
    private m_rememberMe;
    private ubsub;
    private showLoginPanel:boolean = false;

    constructor(private appStore:AppStore, private appdbAction:AppdbAction, private localStorage:LocalStorage, private storeService:StoreService) {
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
        if (!credentials || (credentials && credentials.u == '')) {
            this.showLoginPanel = true;
            if (credentials) {
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
        this.storeService.loadServices();
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


