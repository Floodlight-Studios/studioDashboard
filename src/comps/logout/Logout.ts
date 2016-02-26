///<reference path="../../../typings/app.d.ts" />

import {Component} from "angular2/core";
import {Consts} from "../../../src/Conts";
import {CommBroker} from "../../services/CommBroker";
import {LocalStorage} from "../../services/LocalStorage";

@Component({
    selector: 'Logout',
    providers: [LocalStorage],
    template: `
        <h1><Center>Goodbye</Center></h1>
        <small>I am Logout component</small>
        `
})

export class Logout {
    constructor(localStorage:LocalStorage) {
        localStorage.removeItem('remember_me')
        jQuery('body').fadeOut(1000, function () {
            window.location.replace("https://github.com/born2net/ng2Boilerplate");
        });
    }
}
