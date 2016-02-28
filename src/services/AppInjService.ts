import {Injector} from 'angular2/core';
let appInjectorRef: Injector;
export const appInjService = (injector?: Injector): Injector => {
    if (injector)
        appInjectorRef = injector;
    return appInjectorRef;
};