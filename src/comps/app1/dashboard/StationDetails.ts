import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChange} from 'angular2/core'
import {MODAL_DIRECTIVES} from "../../ng2-bs3-modal/ng2-bs3-modal";

@Component({
    selector: 'stationDetails',
    directives: [MODAL_DIRECTIVES],
    template: `
       <modal #modalAddUserSample [animation]="true" (onClose)="onModalClose($event)">
        <modal-header [show-close]="true">
          <h4 class="modal-title">
            <span class="fa fa-user"></span>
            <!--{{accounts[0]}}-->
          </h4>
        </modal-header>
        <modal-body>
          <!--<Samplelist></Samplelist>-->
        </modal-body>
        <modal-footer [show-default-buttons]="false"></modal-footer>
      </modal>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StationDetails {
    @Input()
    parts = [];
    @Input()
    partsInCart:string;

    private onModalClose($event) {
    }
}

