import {Component, EventEmitter, ChangeDetectionStrategy, Input} from 'angular2/core';
import {FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators} from 'angular2/common'
import {ModalDialog} from "../../modaldialog/ModalDialog";
import {AppStore} from "angular2-redux-util/dist/index";
import {BusinessAction} from "../../../business/BusinessAction";
import {PrivelegesModel} from "../../../reseller/PrivelegesModel";
import {BusinessUser} from "../../../business/BusinessUser";
import {ModalComponent} from "../../ng2-bs3-modal/components/modal";

@Component({
    selector: 'changePass',
    directives: [ModalDialog, FORM_DIRECTIVES],
    templateUrl: '/src/comps/app1/users/ChangePass.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['../comps/app1/users/ChangePass.css']
})

/**
 The first Note1 slider component in a series of sliders / notes.
 Demonstrates the usage of explicit form configuration.
 **/
export class ChangePass {

    constructor(private appStore:AppStore, private businessActions:BusinessAction, private fb:FormBuilder, private modal:ModalComponent) {
        this.notesForm = fb.group({
            matchingPassword: fb.group({
                password: ['', Validators.required],
                confirmPassword: ['', Validators.required]
            }, {validator: this.areEqual})
        });
        this.passwordGroup = this.notesForm.controls['matchingPassword'];
    }

    @Input()
    businessUser:BusinessUser;

    private notesForm:ControlGroup;
    private passwordGroup;

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

    private onSubmit(event) {
        this.appStore.dispatch(this.businessActions.updateBusinessPassword(this.businessUser.getName(),event.matchingPassword.password));
        this.modal.close();
    }

    private onChange(event) {
        if (event.target.value.length < 3)
            console.log('text too short for subject');
    }
}

