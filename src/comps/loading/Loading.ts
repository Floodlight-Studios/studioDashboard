import {Component, Input, ChangeDetectionStrategy} from 'angular2/core'

@Component({
    selector: 'Loading',
    template: `
        <div [ngStyle]="_style">
            <center>
               <h5>Loading</h5>
               <img [src]="src"/>
            </center>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Loading {

    _style:Object;

    @Input()
    src:string = '';

    @Input('style')
    set style(i_style:Object){
        this._style = i_style;

    }
}

