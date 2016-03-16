import {Component, EventEmitter, ChangeDetectionStrategy, Input} from 'angular2/core';
import {ModalDialog} from "../../modaldialog/ModalDialog";
import {
    FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators, AbstractControl, Control
} from 'angular2/common'
import {ModalComponent} from "ng2-bs3-modal/ng2-bs3-modal";
import {BusinessModel} from "../../../business/BusinessModel";
import {BusinessUser} from "../../../business/BusinessUser";
import {Lib} from "../../../Lib";
import {AppStore} from "angular2-redux-util/dist/index";
import {BusinessAction} from "../../../business/BusinessAction";
import {PrivelegesModel} from "../../../reseller/PrivelegesModel";


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

        this.sub = modal.onClose.subscribe(()=> {
            this.passwordGroup.controls['password'].updateValue('')
            this.passwordGroup.controls['confirmPassword'].updateValue('')
        })
        this.passwordGroup = this.notesForm.controls['matchingPassword'];
    }

    @Input()
    businessModel:BusinessModel;

    @Input()
    priveleges:Array<PrivelegesModel> = [];

    private notesForm:ControlGroup;
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

    private onSubmit(event) {
        // const businessUser:BusinessUser = new BusinessUser({
        //     accessMask: computedAccessMask,
        //     privilegeId: privilegeId,
        //     password: event.matchingPassword.password,
        //     name: event.userName,
        //     businessId: this.businessModel.getBusinessId(),
        // });
        // this.appStore.dispatch(this.businessActions.addNewBusinessUser(businessUser));
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

