import {Component, EventEmitter, ChangeDetectionStrategy, Input} from 'angular2/core';
import {ModalDialog} from "../../modaldialog/ModalDialog";
import {
    FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators, AbstractControl, Control
} from 'angular2/common'
import {ModalComponent} from "ng2-bs3-modal/ng2-bs3-modal";
import {SimpleGridRecord} from "../../simplegrid/SimpleGridRecord";
import {BusinessModel} from "../../../business/BusinessModel";


@Component({
    selector: 'addUser',
    directives: [ModalDialog, FORM_DIRECTIVES],
    templateUrl: '/src/comps/app1/users/AddUser.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['../comps/app1/users/AddUser.css']
})

/**
 The first Note1 slider component in a series of sliders / notes.
 Demonstrates the usage of explicit form configuration.
 **/
export class AddUser {

    constructor(private fb:FormBuilder, private modal:ModalComponent) {
        this.notesForm = fb.group({
            'userName': ['', Validators.required],
            matchingPassword: fb.group({
                password: ['', Validators.required],
                confirmPassword: ['', Validators.required]
            }, {validator: this.areEqual}),
            'privileges': ['', Validators.required]
        });

        this.sub = modal.onClose.subscribe(()=> {
            var control:Control = this.notesForm.controls['userName'] as Control;
            this.passwordGroup.controls['password'].updateValue('')
            this.passwordGroup.controls['confirmPassword'].updateValue('')
            control.updateValue('')
        })
        this.passwordGroup = this.notesForm.controls['matchingPassword'];
        this.userName = this.notesForm.controls['userName'];
        this.observeNameChange();
        this.observeFormChange();
    }

    @Input()
    businessId:SimpleGridRecord;

    private notesForm:ControlGroup;
    private userName:AbstractControl;
    private passwordGroup;
    private sub:EventEmitter<any>;

    private areEqual(group:ControlGroup) {
        let valid = true, val;
        for (name in group.controls) {
            if (val === undefined) {
                val = group.controls[name].value
                if (val.length < 4) {
                    valid = false;
                    break;
                }
            } else {
                if (val !== group.controls[name].value) {
                    valid = false;
                    break;
                }
            }
        }
        if (valid) {
            return null;
        }
        return {
            areEqual: true
        };
    }

    /**
     * Listen to observable emitted events from name control
     * use one of the many RX operators debounceTime to control
     * the number of events emitted per milliseconds
     **/
    private observeNameChange() {
        this.userName.valueChanges.debounceTime(100).subscribe(
            (value:string) => {
                console.log('name changed, notified via observable: ', value);
            }
        );
    }

    private observeFormChange() {
        this.notesForm.valueChanges.debounceTime(100).subscribe(
            (value:string) => {
                console.log('forum changed, notified via observable: ', value);
            }
        );
    }

    private onSubmit(event) {
        var businessModel:BusinessModel = this.businessId.item;
        console.log(`Form data businessId: ${businessModel.getBusinessId()} ${JSON.stringify(event)}`);
        this.modal.close();
    }

    private onChange(event) {
        if (event.target.value.length < 3)
            console.log('text too short for subject');
    }

    private ngOnDestroy() {
        this.sub.unsubscribe();
    }
}

