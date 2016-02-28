import {Injectable, Injector} from 'angular2/core';
import {Router, ComponentInstruction} from "angular2/router";
import {AppStore} from "angular2-redux-util";
import {LocalStorage} from "./LocalStorage";
import {StoreService} from "./StoreService";
import {AppdbAction} from "../appdb/AppdbAction";
import {appInjService} from "./AppInjService";
import Map = Immutable.Map;
var bootbox = require('bootbox');

@Injectable()
export class AuthService {
    private ubsub;
    private authenticated:boolean = false;
    private pendingNotify:any;

    constructor(private appStore:AppStore,
                private appdbAction:AppdbAction,
                private localStorage:LocalStorage,
                private storeService:StoreService) {

        this.ubsub = appStore.sub((credentials:Map<string,any>) => {
            this.authenticated = credentials.get('authenticated');
            var user = credentials.get('user');
            var pass = credentials.get('pass');
            var remember = credentials.get('remember');
            if (this.authenticated) {
                this.onAuthPass(user, pass, remember);
            } else {
                this.onAuthFail();
            }
            if (this.pendingNotify)
                this.pendingNotify(this.authenticated)
        }, 'appdb.credentials', false);
    }

    public authUser(i_user?:string, i_pass?:string, i_remember?:string):void {
        bootbox.dialog({
            closeButton: false,
            title: "Please wait, Authenticating...",
            message: " "
        });
        // no user/pass not given try and pull from local storage
        if (!i_user) {
            var credentials = this.localStorage.getItem('remember_me');
            if (credentials && (credentials && credentials.u != '')) {
                i_user = credentials.u;
                i_pass = credentials.p;
                i_remember = credentials.r;
            }
        }
        this.appdbAction.createDispatcher(this.appdbAction.authenticateUser)(i_user, i_pass, i_remember);

    }

    public localStoreCredentialsExist():boolean {
        var credentials = this.localStorage.getItem('remember_me');
        if (!credentials || (credentials && credentials.u == ''))
            return false;
        return true;
    }

    public checkAccess(to:ComponentInstruction, from:ComponentInstruction, target = ['/Home']):Promise<any> {
        let injector:Injector = appInjService();
        let router:Router = injector.get(Router);

        if (this.authenticated)
            return Promise.resolve(true);

        if (!this.localStoreCredentialsExist()) {
            router.navigate(target);
            return Promise.resolve(false);
        }

        return new Promise((resolve) => {
            var credentials = this.localStorage.getItem('remember_me');
            var user = credentials.u;
            var pass = credentials.p;
            var remember = credentials.r;

            this.appdbAction.createDispatcher(this.appdbAction.authenticateUser)(user, pass, remember);

            this.pendingNotify = (status) => {
                resolve(status);
                if (!status) {
                    router.navigate(target);
                    resolve(false);
                }
            }
        });
    }

    private onAuthPass(i_user, i_pass, i_remember) {
        bootbox.hideAll();
        if (i_remember) {
            this.localStorage.setItem('remember_me', {
                u: i_user,
                p: i_pass,
                r: i_remember
            });
        } else {
            this.localStorage.setItem('remember_me', {
                u: '',
                p: '',
                r: i_remember
            });
        }
        this.storeService.loadServices();
    }

    private onAuthFail() {
        setTimeout(()=> {
            bootbox.hideAll();
            this.localStorage.setItem('remember_me', {
                u: '',
                p: '',
                r: ''
            });
        }, 1000);
        return false;
    }

    ngOnDestroy() {
        this.ubsub();
    }
}