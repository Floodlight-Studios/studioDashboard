import {Injectable} from "angular2/core";
import {Actions, AppStore} from "angular2-redux-util";
import {Http, Jsonp} from "angular2/http";
import {PrivelegesModel} from "./PrivelegesModel";
import {PrivelegesTemplateModel} from "./PrivelegesTemplateModel";
import {Lib} from "../Lib";
import {List, Map} from 'immutable';
const Immutable = require('immutable');
const _ = require('underscore');

export const RECEIVE_PRIVILEGES = 'RECEIVE_PRIVILEGES';
export const RECEIVE_PRIVILEGES_SYSTEM = 'RECEIVE_PRIVILEGES_SYSTEM';
export const UPDATE_PRIVILEGES = 'UPDATE_PRIVILEGES';
export const UPDATE_PRIVILEGE_NAME = 'UPDATE_PRIVILEGE_NAME';
export const RECEIVE_DEFAULT_PRIVILEGE = 'RECEIVE_DEFAULT_PRIVILEGE';
export const UPDATE_DEFAULT_PRIVILEGE = 'UPDATE_DEFAULT_PRIVILEGE';
export const ADD_PRIVILEGE = 'ADD_PRIVILEGE';
export const REMOVE_PRIVILEGE = 'REMOVE_PRIVILEGE';

@Injectable()
export class ResellerAction extends Actions {
    parseString;

    constructor(private appStore:AppStore, private _http:Http, private jsonp:Jsonp) {
        super(appStore);
        this.parseString = require('xml2js').parseString;
    }

    private privilegesModelFactory(i_defaultPrivId:number, i_defaultPrivName, i_privilegesSystemModels:Array<PrivelegesTemplateModel>, i_groups?:Array<any>):PrivelegesModel {
        let groups = List();
        let tablesDst = [];
        if (i_groups) {
            i_groups.forEach((privilegesGroups:any)=> {
                var tableName = privilegesGroups._attr.name;
                tablesDst.push(tableName)
                var group = Map({
                    tableName: tableName,
                    columns: Immutable.fromJS(privilegesGroups.Tables["0"]._attr)
                });
                groups = groups.push(group)
            })
        }
        // fill up any new or missing tables
        i_privilegesSystemModels.forEach((privelegesTemplateModel:PrivelegesTemplateModel)=>{
            var srcTableName = privelegesTemplateModel.getTableName();
            // need to add a new tables
            if (tablesDst.indexOf(srcTableName)==-1){
                console.log();
                console.log();
                console.log();
                console.log();
                groups = groups.push(privelegesTemplateModel.getData())
            }
        })
        let privilegesModel:PrivelegesModel = new PrivelegesModel({
            privilegesId: i_defaultPrivId,
            name: i_defaultPrivName,
            groups: groups
        });
        return privilegesModel;
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

                        console.log(result);
                        if (err) {
                            bootbox.alert('problem loading user info')
                            return;
                        }

                        Lib.PrivilegesXmlTemplate((err, privilegesXmlTemplate)=> {
                            /**
                             * redux inject privileges XML template system
                             **/
                            var privilegesSystemModels = [];
                            privilegesXmlTemplate.Privilege.Groups["0"].Group.forEach((table)=> {
                                let privelegesSystemModel:PrivelegesTemplateModel = new PrivelegesTemplateModel({
                                    tableName: table._attr.name,
                                    columns: Immutable.fromJS(table.Tables["0"]._attr)
                                });
                                if (privelegesSystemModel.getColumnSize() > 0)
                                    privilegesSystemModels.push(privelegesSystemModel)
                            })
                            dispatch(self.receivePrivilegesSystem(privilegesSystemModels));
                            /**
                             * redux inject privileges user
                             **/
                            var defaultPrivId = result.User.BusinessInfo[0].Privileges[0]._attr.defaultPrivilegeId;
                            dispatch(self.receiveDefaultPrivilege(defaultPrivId));
                            var privilegesModels:List<PrivelegesModel> = List<PrivelegesModel>();

                            result.User.BusinessInfo["0"].Privileges["0"].Privilege.forEach((privileges)=> {
                                let privilegesModel:PrivelegesModel = self.privilegesModelFactory(privileges._attr.id, privileges._attr.name, privilegesSystemModels, privileges.Groups["0"].Group)
                                privilegesModels = privilegesModels.push(privilegesModel)
                            });
                            dispatch(self.receivePrivileges(privilegesModels));
                        });
                    });
                }).subscribe();
        }
    }

    public createPrivilege() {
        var self = this;
        return (dispatch)=> {
            // var appdb:Map<string,any> = this.appStore.getState().appdb;
            // var url = appdb.get('appBaseUrlUser') + `&command=GetBusinessUserInfo`;
            // this._http.get(url)
            //     .map(result => {
            //         var xmlData:string = result.text()
            //         xmlData = xmlData.replace(/}\)/, '').replace(/\(\{"result":"/, '');
            //         this.parseString(xmlData, {attrkey: '_attr'}, function (err, result) {
            //     }).subscribe();
            //todo: contact server for creation of privilege id, emulating server for now
            let groups = List();
            // var group = Map({
            //     tableName: privilegesGroups._attr.name,
            //     columns: Immutable.fromJS(privilegesGroups.Tables["0"]._attr)
            // });
            // groups = groups.push(group)
            var privilegesModel:PrivelegesModel = new PrivelegesModel({
                privilegesId: _.random(1000, 9999),
                name: 'Privilege set',
                groups: groups
            });

            // privilegesModel:PrivelegesModel = this.privilegesModelFactory(_.random(1000, 9999),'privilege set',[],[])
            setTimeout(()=> {
                dispatch(self.addPrivilege(privilegesModel));
            }, 100)
        }
    }

    public addPrivilege(privelegesModel:PrivelegesModel) {
        return {
            type: ADD_PRIVILEGE,
            privelegesModel
        }
    }

    public receivePrivileges(privilegesModels:List<PrivelegesModel>) {
        return {
            type: RECEIVE_PRIVILEGES,
            privilegesModels
        }
    }

    public receiveDefaultPrivilege(privilegeId:number) {
        return {
            type: RECEIVE_DEFAULT_PRIVILEGE,
            privilegeId
        }
    }

    public updateDefaultPrivilege(privilegeId:number) {
        return {
            type: UPDATE_DEFAULT_PRIVILEGE,
            privilegeId
        }
    }

    public updateDefaultPrivilegeName(privilegeId:number, privilegeName:string) {
        return {
            type: UPDATE_PRIVILEGE_NAME,
            privilegeId,
            privilegeName
        }
    }


    public receivePrivilegesSystem(privelegesSystemModels:Array<PrivelegesTemplateModel>) {
        return {
            type: RECEIVE_PRIVILEGES_SYSTEM,
            privelegesSystemModels
        }
    }

    public removePrivilege(privilegeId:number) {
        return {
            type: REMOVE_PRIVILEGE,
            privilegeId
        }
    }

    public updatePrivilegesSystem(payload) {
        return {
            type: UPDATE_PRIVILEGES,
            payload
        }
    }
}
