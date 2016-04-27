import {Pipe, PipeTransform} from 'angular2/core';
import * as _ from 'lodash';
import {List} from 'immutable';
import {StoreModel} from "../models/StoreModel";

/** order by filter **/

@Pipe({
    name: 'OrderBy'
})
export class OrderBy implements PipeTransform {
    // remove in ng2 beta0.16
    // transform(input: Object[], [field, desc = false]: [string, boolean]): Object[] {
    transform(input: Object[], ...args:any[]): Object[] {
        var field =  args[0];
        var desc = args[1] == undefined ? false : args[1];
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

/**
 *    https://github.com/ocombe/ng2-translate/blob/master/src/translate.pipe.ts
 *
 *     transform(query: string, ...args: any[]): any {
        if(!query || query.length === 0) {
            return query;
        }
        // if we ask another time for the same key, return the last value
        if(this.equals(query, this.lastKey) && this.equals(args, this.lastParams)) {
            return this.value;
        }

        var interpolateParams: Object;
        if(args.length && args[0] !== null) {
            if(typeof args[0] === 'string' && args[0].length) {
                // we accept objects written in the template such as {n:1},
                // which is why we might need to change it to real JSON objects such as {"n":1}
                try {
                    interpolateParams = JSON.parse(args[0].replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": '));
                } catch (e) {
                    throw new SyntaxError(`Wrong parameter in TranslatePipe. Expected a valid Object, received: ${args[0]}`);
                }
            } else if(typeof args[0] === 'object' && !Array.isArray(args[0])) {
                interpolateParams = args[0];
            }
        }
 **/