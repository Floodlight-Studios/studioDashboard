import {Injectable} from "angular2/core";
import {Actions, AppStore} from "angular2-redux-util";
import {Http, Jsonp} from "angular2/http";
import {PrivelegesModel} from "./PrivelegesModel";
import {PrivelegesTemplateModel} from "./PrivelegesTemplateModel";
import {Lib} from "../Lib";
import {List, Map} from 'immutable';
import {AppModel} from "./AppModel";
const Immutable = require('immutable');
const _ = require('underscore');

export const RECEIVE_PRIVILEGES = 'RECEIVE_PRIVILEGES';
export const RECEIVE_PRIVILEGES_SYSTEM = 'RECEIVE_PRIVILEGES_SYSTEM';
export const UPDATE_PRIVILEGES = 'UPDATE_PRIVILEGES';
export const UPDATE_PRIVILEGE_NAME = 'UPDATE_PRIVILEGE_NAME';
export const RECEIVE_DEFAULT_PRIVILEGE = 'RECEIVE_DEFAULT_PRIVILEGE';
export const RECEIVE_APPS = 'RECEIVE_APPS';
export const UPDATE_DEFAULT_PRIVILEGE = 'UPDATE_DEFAULT_PRIVILEGE';
export const ADD_PRIVILEGE = 'ADD_PRIVILEGE';
export const REMOVE_PRIVILEGE = 'REMOVE_PRIVILEGE';

@Injectable()
export class ResellerAction extends Actions {


    constructor(private appStore:AppStore, private _http:Http, private jsonp:Jsonp) {
        super(appStore);
        this.m_parseString = require('xml2js').parseString;
    }

    private m_parseString;
    private m_privilegesSystemModels:Array<PrivelegesTemplateModel> = [];

    private privilegesModelFactory(i_defaultPrivId:number, i_defaultPrivName, i_existingGroups?:Array<any>):PrivelegesModel {
        let groups = List();
        let tablesDst = [];
        if (i_existingGroups) {
            i_existingGroups.forEach((privilegesGroups:any)=> {
                var tableName = privilegesGroups._attr.name;
                tablesDst.push(tableName)
                var group = Map({
                    tableName: tableName,
                    columns: Immutable.fromJS(privilegesGroups.Tables["0"]._attr)
                });
                groups = groups.push(group);
            })
        }
        // fill up any new or missing tables
        this.m_privilegesSystemModels.forEach((privelegesTemplateModel:PrivelegesTemplateModel)=> {
            var srcTableName = privelegesTemplateModel.getTableName();
            if (tablesDst.indexOf(srcTableName) == -1)
                groups = groups.push(privelegesTemplateModel.getData());
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
                    this.m_parseString(xmlData, {attrkey: '_attr'}, function (err, result) {
                        if (err) {
                            bootbox.alert('problem loading user info')
                            return;
                        }

                        Lib.AppsXmlTemplate((err, xmlTemplate)=> {
                            /**
                             * redux inject Apps
                             **/
                            var apps = {};
                            xmlTemplate.Apps.App.forEach((i_app) => {
                                apps[i_app._attr.id] = {
                                    desc: i_app.Description["0"],
                                    appName: i_app._attr.appName,
                                    id: i_app._attr.id,
                                    moduleId: i_app.Components["0"].Component["0"]._attr.moduleId,
                                    uninstallable: i_app._attr.uninstallable,
                                    showInScene: i_app.Components["0"].Component["0"]._attr.showInScene,
                                    showInTimeline: i_app.Components["0"].Component["0"]._attr.showInTimeline,
                                    version: i_app.Components["0"].Component["0"]._attr.version
                                }
                            })

                            var userApps:List<AppModel> = List<AppModel>();
                            result.User.BusinessInfo["0"].InstalledApps["0"].App.forEach((i_app)=> {
                                var appId = i_app._attr.id;
                                if (!_.isUndefined(apps[appId])){
                                    var app:AppModel = new AppModel({
                                        appId: appId,
                                        installed: i_app._attr.installed,
                                        appName: apps[appId]['appName'],
                                        moduleId: apps[appId]['moduleId'],
                                        uninstallable: apps[appId]['uninstallable'],
                                        showInScene: apps[appId]['showInScene'],
                                        showInTimeline: apps[appId]['showInTimeline'],
                                        version: apps[appId]['version']
                                    })
                                    userApps = userApps.push(app);
                                }
                            })
                            dispatch(self.apps(userApps));
                        });

                        Lib.PrivilegesXmlTemplate((err, xmlTemplate)=> {


                            /**
                             * redux inject privileges XML template system
                             **/
                            //var privilegesSystemModels = [];
                            xmlTemplate.Privilege.Groups["0"].Group.forEach((table)=> {
                                let privelegesSystemModel:PrivelegesTemplateModel = new PrivelegesTemplateModel({
                                    tableName: table._attr.name,
                                    columns: Immutable.fromJS(table.Tables["0"]._attr)
                                });
                                if (privelegesSystemModel.getColumnSize() > 0)
                                    self.m_privilegesSystemModels.push(privelegesSystemModel)
                            })
                            dispatch(self.receivePrivilegesSystem(self.m_privilegesSystemModels));

                            /**
                             * redux inject privileges user
                             **/
                            var defaultPrivId = result.User.BusinessInfo[0].Privileges[0]._attr.defaultPrivilegeId;
                            dispatch(self.receiveDefaultPrivilege(defaultPrivId));
                            var privilegesModels:List<PrivelegesModel> = List<PrivelegesModel>();

                            result.User.BusinessInfo["0"].Privileges["0"].Privilege.forEach((privileges)=> {
                                let privilegesModel:PrivelegesModel = self.privilegesModelFactory(privileges._attr.id, privileges._attr.name, privileges.Groups["0"].Group);
                                privilegesModels = privilegesModels.push(privilegesModel)
                            });
                            dispatch(self.receivePrivileges(privilegesModels));
                        });
                    });
                }).subscribe();
        }
    }

    public createPrivilege() {
        return (dispatch)=> {
            // var appdb:Map<string,any> = this.appStore.getState().appdb;
            // var url = appdb.get('appBaseUrlUser') + `&command=GetBusinessUserInfo`;
            // this._http.get(url)
            //     .map(result => {
            //         var xmlData:string = result.text()
            //         xmlData = xmlData.replace(/}\)/, '').replace(/\(\{"result":"/, '');
            //         this.m_parseString(xmlData, {attrkey: '_attr'}, function (err, result) {
            //     }).subscribe();

            //todo: contact server for creation of privilege id, emulating server for now
            var privilegesModel:PrivelegesModel = this.privilegesModelFactory(_.random(1000, 9999), 'privilege set')
            setTimeout(()=> {
                dispatch(this.addPrivilege(privilegesModel));
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

    public apps(apps:Array<AppModel>) {
        return {
            type: RECEIVE_APPS,
            apps
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
