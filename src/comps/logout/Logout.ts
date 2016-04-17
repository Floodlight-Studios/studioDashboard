import {Component} from "angular2/core";
import {AppStore} from "angular2-redux-util";
import {LocalStorage} from "../../services/LocalStorage";
const _ = require('underscore');

@Component({
    selector: 'Logout',
    providers: [LocalStorage],
    template: `
        <h1><Center>Goodbye</Center></h1>
        <small>I am Logout component</small>
        `
})

export class Logout {
    constructor(private appStore:AppStore, private localStorage:LocalStorage) {
        var linksHome = this.appStore.getState().reseller.getIn(['whitelabel']).getKey('linksHome');
        if (_.isEmpty(linksHome))
            linksHome = 'http://www.digitalsignage.com';
        this.localStorage.removeItem('remember_me')
        jQuery('body').fadeOut(1000, function () {
            window.location.replace(linksHome);
        });
    }
}
