import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from 'angular2/core'
import {CanActivate, ComponentInstruction} from "angular2/router";
import {AuthService} from "../../../services/AuthService";
import {appInjService} from "../../../services/AppInjService";

@Component({
    selector: 'accounts',
    styles: [`
    hr {
        display: block;
        height: 1px;
        border: 0;
        border-top: 1px solid #ccc;
        margin: 2em 0em;
        padding: 0; 
    }
    `],
    templateUrl: `/src/comps/app1/account/Account.html`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
@CanActivate((to:ComponentInstruction, from:ComponentInstruction) => {
    let authService:AuthService = appInjService().get(AuthService);
    return authService.checkAccess(to, from, ['/Login/Login']);
})
export class Account {
    @Input()
    parts = [];
    @Input()
    partsInCart:string;

    @Output()
    addToCart:EventEmitter<any> = new EventEmitter();
}

