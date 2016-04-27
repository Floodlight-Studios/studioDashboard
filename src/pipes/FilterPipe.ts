import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({
    name: 'FilterPipe'
})
export class FilterPipe implements PipeTransform {
    // transform(input, filter):boolean {
    transform(input, ...args):boolean {
        var filter = args[0];
        if (!input || filter == "")
            return false;
        if (input.indexOf(filter) > -1)
            return false;
        return true;
    }
}