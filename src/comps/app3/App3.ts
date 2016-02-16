import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {RouterLink, RouteParams} from 'angular2/router';

@Component({
    templateUrl: '/src/comps/app3/App3.html',
    directives: [ROUTER_DIRECTIVES, RouterLink]
})
export class App3 {

    constructor() {
    }
}