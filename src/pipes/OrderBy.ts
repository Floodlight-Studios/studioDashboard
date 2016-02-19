import {Pipe, PipeTransform} from 'angular2/core';
import * as _ from 'lodash';
import {List} from 'immutable';
import {StoreModel} from "../models/StoreModel";

/** order by filter **/

@Pipe({
    name: 'OrderBy'
})
export class OrderBy implements PipeTransform {

    transform(input: Object[], [field, desc = false]: [string, boolean]): Object[] {
        if (input && field) {
            return Array.from(input).sort((a: StoreModel, b: StoreModel) => {
                if (a.getKey(field) < b.getKey(field)) {
                    return desc ? 1 : -1;
                }
                if (a.getKey(field) > b.getKey(field)) {
                    return desc ? -1 : 1;
                }
                return 0;
            });
        }
        return input;
    }

}