import {Component} from 'angular2/core'
import {BusinessView} from "../business/BusinessView";

@Component({
    selector: 'Users',
    directives: [BusinessView],
    styles: [`
      .userView {
        background-color: lightgray;
      }
    `],
    template: `
        <div class="row">
             <div class="col-xs-3">
                <BusinessView></BusinessView>
             </div>
             <div class="col-xs-9 userView" appHeight>
                <h1>users view</h1>
                <h1>users view</h1>
                <h1>users view</h1>
                <h1>users view</h1>
                <h1>users view</h1>
                <h1>users view</h1>
                <h1>users view</h1>
                <h1>users view</h1>
                <h1>users view</h1>
                <h1>users view</h1>
             </div>
        </div>

    `
})
export class Users {
}

