import {Injectable} from "angular2/core";
import {Actions, AppStore} from "angular2-redux-util";
import {Http, Jsonp} from "angular2/http";
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/debounceTime';
import {PrivelegesModel} from "./PrivelegesModel";

export const RECEIVE_PRIVILEGES = 'RECEIVE_PRIVILEGES';

@Injectable()
export class ResellerAction extends Actions {
    parseString;

    constructor(private appStore:AppStore, private _http:Http, private jsonp:Jsonp) {
        super(appStore);
        this.parseString = require('xml2js').parseString;
    }

    public getResellerInfo() {
        var self = this;
        return (dispatch)=> {
            var appdb:Map<string,any> = this.appStore.getState().appdb;
            var url = appdb.get('appBaseUrlUser') + `&command=GetBusinessUserInfo`;
            this._http.get(url)
                .map(result => {

                    var xmlData:string = result.text()
                    xmlData = xmlData.replace(/}\)/, '').replace(/\(\{"result":"/, '');
                    this.parseString(xmlData, {attrkey: '_attr'}, function (err, result) {
                        if (err){
                            bootbox.alert('problem loading user info')
                            return;
                        }
                        var privilegesModels = [];
                        result.User.BusinessInfo["0"].Privileges["0"].Privilege.forEach((privileges)=> {
                            let privilegesModel:PrivelegesModel = new PrivelegesModel({
                                privilegesId: privileges._attr.id,
                                name: privileges._attr.name
                            });
                            privilegesModels.push(privilegesModel)
                        });
                        dispatch(self.receivePrivileges(privilegesModels));
                    });

                }).subscribe();
        }
    }

    public receivePrivileges(privilegesModels:Array<PrivelegesModel>) {
        return {
            type: RECEIVE_PRIVILEGES,
            privilegesModels
        }
    }
}
