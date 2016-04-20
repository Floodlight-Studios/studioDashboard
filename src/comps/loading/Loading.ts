import {Component, Input, ChangeDetectionStrategy} from 'angular2/core'

@Component({
    selector: 'Loading',
    styles: [`
        .spinner {
          position:fixed;
          left: 40px;
          display: inline-block;
          width: 50px;
          height: 50px;
          border: 3px solid rgba(0,0,0,.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s ease-in-out infinite;
          -webkit-animation: spin 1s ease-in-out infinite; 
        }
        
        @keyframes spin {
          to { -webkit-transform: rotate(360deg); }
        }
        @-webkit-keyframes spin {
          to { -webkit-transform: rotate(360deg); }
        }
    `],
    template: `
        <div [ngStyle]="_style">
            <center>
               <h5>Loading</h5>
                <!--<div *ngIf="show" class="spinner"></div>-->
                <div class="spinner"></div>
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
    set style(i_style:Object) {
        this._style = i_style;

    }
}

