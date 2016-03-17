import {Injectable} from "angular2/core";
import {Actions, AppStore} from "angular2-redux-util";
import {Http, Jsonp} from "angular2/http";
import {PrivelegesModel} from "./PrivelegesModel";
import {PrivelegesSystemModel} from "./PrivelegesSystemModel";
import {Lib} from "../Lib";
var Immutable = require('immutable');

export const RECEIVE_PRIVILEGES = 'RECEIVE_PRIVILEGES';
export const RECEIVE_PRIVILEGES_SYSTEM = 'RECEIVE_PRIVILEGES_SYSTEM';


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

                        if (err) {
                            bootbox.alert('problem loading user info')
                            return;
                        }

                        // redux inject privileges system
                        var privilegesSystemModels = [];
                        var tables = result.User.BusinessInfo["0"].Privileges["0"].Privilege["0"].Groups["0"].Group;
                        tables.forEach((table)=> {
                            let privelegesSystemModel:PrivelegesSystemModel = new PrivelegesSystemModel({
                                tableName: table._attr.name,
                                columns: Immutable.fromJS(table.Tables["0"]._attr)
                            });
                            if (privelegesSystemModel.getColumnSize() > 0)
                                privilegesSystemModels.push(privelegesSystemModel)
                        })
                        dispatch(self.receivePrivilegesSystem(privilegesSystemModels));
                        // var serializedData:Array<any> = Lib.ConstructImmutableFromTable(result.User.BusinessInfo["0"].ResellerInfo["0"].BusinessInfo["0"].Privilege["0"].Groups["0"].Group)
                        // var serializedData:Array<any> = Lib.ConstructImmutableFromTable(columns)
                        // serializedData.forEach((immObj:Map<string,any>)=> {
                        // })


                        // redux inject privileges user
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

    public receivePrivilegesSystem(privelegesSystemModels:Array<PrivelegesSystemModel>) {
        return {
            type: RECEIVE_PRIVILEGES_SYSTEM,
            privelegesSystemModels
        }
    }
}
