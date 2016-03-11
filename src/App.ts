require('bootstrap');
import Immutable = require('immutable');
import 'zone.js/dist/zone.min.js';
import "reflect-metadata";
import 'twbs/bootstrap/css/bootstrap.css!';
import './styles/style.css!';
import {appInjService} from "./services/AppInjService";
import {LocalStorage} from "./services/LocalStorage";
import {AuthService} from "./services/AuthService";
import {StoreService} from "./services/StoreService";
import {BusinessAction} from "./business/BusinessAction";
import {CharCount} from "./pipes/CharCount";
import {bootstrap} from 'angular2/platform/browser';
import {HTTP_PROVIDERS, JSONP_PROVIDERS} from "angular2/http";
import {App1} from '../src/comps/app1/App1';
import {Component, provide, ViewEncapsulation, PLATFORM_PIPES, Injector, ComponentRef} from 'angular2/core';
import {EntryPanel} from '../src/comps/entry/EntryPanel';
import {AppManager} from '../src/comps/appmanager/AppManager';
import {CommBroker} from '../src/services/CommBroker';
import {Filemenu} from "../src/comps/filemenu/Filemenu";
import {FilemenuItem} from "../src/comps/filemenu/FilemenuItem";
import {Logo} from "./comps/logo/Logo";
import {Footer} from "./comps/footer/Footer";
import {Consts} from "../src/Conts";
import {StyleService} from "./styles/StyleService";
import {ROUTER_DIRECTIVES, ROUTER_PROVIDERS, AsyncRoute, Router} from 'angular2/router';
import {LocationStrategy, RouteParams, RouterLink, HashLocationStrategy, RouteConfig} from 'angular2/router';
import {AppStore} from "angular2-redux-util";
import {Lib} from "./Lib";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/distinctUntilChanged';
import notify from "./appdb/NotifyReducer"
import appdb from "./appdb/AppdbReducer"
import stations from "./appdb/StationsReducer"
import {business} from "./business/BusinessReducer"
import {AppdbAction} from "./appdb/AppdbAction";
import {Welcome} from "./comps/welcome/Welcome";
// import {enableProdMode} from 'angular2/core';

/**
 Main application bootstrap
 @class App
 **/
@Component({
    selector: 'app',
    encapsulation: ViewEncapsulation.Emulated,
    providers: [StyleService, AppdbAction],
    templateUrl: '/src/App.html',
    directives: [ROUTER_DIRECTIVES, RouterLink, Filemenu, FilemenuItem, Logo, Footer]
})
@RouteConfig([
    {path: "/", name: "root", redirectTo: ["/EntryPanelNoId/Login"], useAsDefault: true},
    {path: '/AppManager', component: AppManager, as: 'AppManager'},
    {path: '/Welcome', component: Welcome, as: 'Welcome'},
    {path: '/EntryPanelNoId/...', component: EntryPanel, as: 'EntryPanelNoId'},
    {path: '/EntryPanel/:id/...', component: EntryPanel, as: 'EntryPanel'},
    {path: '/Login/...', component: EntryPanel, as: 'Login'},
    {path: '/ForgotPass/...', component: EntryPanel, as: 'ForgotPass'},
    {path: '/App1/...', component: App1, as: 'App1'},
])
export class App {
    private m_styleService:StyleService;

    constructor(private appStore:AppStore, private commBroker:CommBroker, styleService:StyleService, private appdbAction:AppdbAction, private router:Router) {
        this.m_styleService = styleService;
        this.commBroker.setService(Consts.Services().App, this);
        Observable.fromEvent(window, 'resize').debounceTime(250).subscribe(()=> {
            this.appResized();
        });
        appStore.dispatch(appdbAction.initAppDb());

        router.subscribe(function (currentRoute) {
            console.log(currentRoute);
        });
    }

    public appResized():void {
        var appHeight = document.body.clientHeight;
        var appWidth = document.body.clientWidth;
        //console.log('resized ' + appHeight);
        // jQuery(Consts.Elems().APP_NAVIGATOR_EVER).height(appHeight - 115);
        // jQuery(Consts.Elems().APP_NAVIGATOR_WASP).height(appHeight - 115);
        // jQuery(Consts.Clas().CLASS_APP_HEIGHT).height(appHeight - 420);
        // jQuery('#mainPanelWrap').height(appHeight - 115);
        // jQuery('#propPanel').height(appHeight - 130);
        // jQuery('.well').height(appHeight - 224);

        this.commBroker.setValue(Consts.Values().APP_SIZE, {height: appHeight, width: appWidth});

        this.commBroker.fire({
            fromInstance: self,
            event: Consts.Events().WIN_SIZED,
            context: '',
            message: {height: appHeight, width: appWidth}
        })
    }
}

// enableProdMode();
bootstrap(App, [ROUTER_PROVIDERS, HTTP_PROVIDERS, JSONP_PROVIDERS,
    provide(AppStore, {useFactory: Lib.StoreFactory({notify, appdb, business, stations})}),
    provide(StoreService, {useClass: StoreService}),
    provide(BusinessAction, {useClass: BusinessAction}),
    provide(AppdbAction, {useClass: AppdbAction}),
    provide(AuthService, {useClass: AuthService}),
    provide(LocalStorage, {useClass: LocalStorage}),
    provide(CommBroker, {useClass: CommBroker}),
    provide(Consts, {useClass: Consts}),
    provide(PLATFORM_PIPES, {useValue: CharCount, multi: true}),
    provide(LocationStrategy, {useClass: HashLocationStrategy})]).then((appRef:ComponentRef) => {
        appInjService(appRef.injector);
    }
);


