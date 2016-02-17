import {Pipe, PipeTransform} from 'angular2/core';
import {BusinessModel} from "../comps/app1/business/BusinesModel";

@Pipe({
    name: 'FilterPipe'
})
export class FilterPipe implements PipeTransform {
    transform(input, filter):boolean {
        if (!input || filter[0] == "")
            return false;
        if (input.indexOf(filter[0]) > -1)
            return false;
        return true;
    }
}