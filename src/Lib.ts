/** Common Library **/

import {Injectable} from 'angular2/core';
import {createStore, combineReducers, applyMiddleware, compose} from "redux";
import * as thunkMiddleware from 'redux-thunk';
import {AppStore} from "angular2-redux-util";
import {List, Map} from 'immutable';
import {LoggerMiddleware} from "angular2-redux-util";
import {BusinessUser} from "./business/BusinessUser";
import {PrivelegesModel} from "./reseller/PrivelegesModel";
var Immutable = require('immutable');
const _ = require('underscore');

@Injectable()
export class Lib {

    static StoreFactory(reducerList:Object) {
        return () => {
            const reducers = combineReducers(reducerList);
            //const middlewareEnhancer = applyMiddleware(<any>thunkMiddleware, LoggerMiddleware); // to enable logger
            const middlewareEnhancer = applyMiddleware(<any>thunkMiddleware);
            const isDebug = window.devToolsExtension;
            const applyDevTools = () => isDebug ? window.devToolsExtension() : f => f;
            const enhancers = compose(middlewareEnhancer, applyDevTools());
            const createStoreWithEnhancers = enhancers(createStore);
            const reduxAppStore = createStoreWithEnhancers(reducers);
            return new AppStore(reduxAppStore);
        };
    }

    static BooleanToNumber(value:any):any {
        if (_.isUndefined(value) || _.isNull(value))
            return 0;
        if (value === "0" || value === 'false' || value === "False" || value === false)
            return 0;
        if (value === 1 || value === "true" || value === "True" || value === true)
            return 1;
        return value;
    }

    static CleanCharForXml(value:any):any {
        var clean = function (value:string) {
            if (_.isNull(value))
                return '';
            if (_.isNumber(value))
                return value;
            if (_.isBoolean(value))
                return value;
            value = value.replace(/\}/g, ' ');
            value = value.replace(/%/g, ' ');
            value = value.replace(/{/g, ' ');
            value = value.replace(/"/g, '`');
            value = value.replace(/'/g, '`');
            value = value.replace(/&/g, 'and');
            value = value.replace(/>/g, ' ');
            value = value.replace(/</g, ' ');
            value = value.replace(/\[/g, ' ');
            value = value.replace(/]/g, ' ');
            value = value.replace(/#/g, ' ');
            value = value.replace(/\$/g, ' ');
            value = value.replace(/\^/g, ' ');
            value = value.replace(/;/g, ' ');
            return value
        }
        if (_.isNull(value))
            return '';
        if (_.isNumber(value))
            return value;
        if (_.isBoolean(value))
            return value;
        if (_.isString(value))
            return clean(value);
        _.forEach(value, (v, k)=> {
            value[k] = clean(v);
        });
        return value;
    }

    static MapOfIndex(map:Map<string,any>, index:number, position:"first" | "last"):string {
        var mapJs = map.toJS();
        var mapJsPairs = _.pairs(mapJs);
        var offset = position == 'first' ? 0 : 1;
        if (mapJsPairs[index] == undefined)
            return "0"
        return mapJsPairs[index][offset];
    }

    /**
     *  PrivilegesXmlTemplate will generate a template for priveleges in 2 possible modes
     *
     *  mode 1: just a raw template (we will ignore the values set) and this is the mode when
     *  no selPrivName and appStore params are given
     *
     *  mode 2: is when we actually serialize data to save to server and in this mode we do pass
     *  in the selPrivName and appStore which we use to retrieve current values from user appStore
     *  and generate the final XML to save to server
     *
     * @param selPrivName
     * @param appStore
     * @param callBack
     * @constructor
     */
    static PrivilegesXmlTemplate(selPrivName:string, appStore:AppStore = null, callBack:(err, result)=>any) {
        const parseString = require('xml2js').parseString;

        var getAttributeGroup = (tableName:string, attribute:string) => {
            if (_.isNull(appStore))
                return 0;
            var result = 0;
            var reseller = appStore.getState().reseller;
            var privileges = reseller.getIn(['privileges']);
            privileges.forEach((i_privelegesModel:PrivelegesModel, counter)=> {
                if (i_privelegesModel.getName() == selPrivName) {
                    i_privelegesModel.getColumns().forEach((group, c) => {
                        if (group.get('tableName') == tableName)
                            return result = group.get(attribute)
                    })
                }
            })
            console.log(`${result} ${tableName} ${attribute}`);
            return result;
        }

        var getPrivilegesTable = (tableName:string, attribute:string) => {
            if (_.isNull(appStore))
                return 0;
            var result = 0;
            var reseller = appStore.getState().reseller;
            var privileges = reseller.getIn(['privileges']);
            privileges.forEach((i_privelegesModel:PrivelegesModel, counter)=> {
                if (i_privelegesModel.getName() == selPrivName) {
                    i_privelegesModel.getColumns().forEach((group, c) => {
                        if (group.get('tableName') == tableName)
                            return result = group.getIn(['columns', attribute])
                    })
                }
            })
            // console.log(`${result} ${tableName} ${attribute}`);
            return result;
        }

        var xmlData = `
          <Privilege>
              <Groups>
                <Group name="Global" visible="${getAttributeGroup('Global', 'visible')}">
                  <Tables global_settings="${getPrivilegesTable('Global', 'global_settings')}"/>
                </Group>
                <Group name="Screens" visible="${getAttributeGroup('Screens', 'visible')}">
                  <Tables boards="${getPrivilegesTable('Screens', 'boards')}" board_templates="${getPrivilegesTable('Screens', 'board_templates')}" board_template_viewers="${getPrivilegesTable('Screens', 'board_template_viewers')}"/>
                </Group>
                <Group name="Resources" visible="${getAttributeGroup('Resources', 'visible')}" resourceMode="${getAttributeGroup('Resources', 'resourceMode')}">
                  <Tables resources="${getPrivilegesTable('Resources', 'resources')}"/>
                </Group>                
                <Group name="Editors" visible="${getAttributeGroup('Editors', 'visible')}">
                  <Tables player_data="${getPrivilegesTable('Editors', 'player_data')}"/>
                </Group>
                <Group name="Catalog" visible="${getAttributeGroup('Catalog', 'visible')}">
                  <Tables catalog_items="${getPrivilegesTable('Catalog', 'catalog_items')}" catalog_item_infos="${getPrivilegesTable('Catalog', 'catalog_item_infos')}" catalog_item_resources="${getPrivilegesTable('Catalog', 'catalog_item_resources')}" catalog_item_categories="${getPrivilegesTable('Catalog', 'catalog_item_categories')}" category_values="${getPrivilegesTable('Catalog', 'category_values')}"/>
                </Group>
                <Group name="Campaigns" visible="${getAttributeGroup('Campaigns', 'visible')}">
                  <Tables campaigns="${getPrivilegesTable('Campaigns', 'campaigns')}" campaign_events="${getPrivilegesTable('Campaigns', 'campaign_events')}" campaign_timelines="${getPrivilegesTable('Campaigns', 'campaign_timelines')}" campaign_timeline_sequences="${getPrivilegesTable('Campaigns', 'campaign_timeline_sequences')}" campaign_timeline_schedules="${getPrivilegesTable('Campaigns', 'campaign_timeline_schedules')}" campaign_sequences="${getPrivilegesTable('Campaigns', 'campaign_sequences')}" campaign_sequence_timelines="${getPrivilegesTable('Campaigns', 'campaign_sequence_timelines')}" campaign_sequence_schedules="${getPrivilegesTable('Campaigns', 'campaign_sequence_schedules')}" campaign_timeline_channels="${getPrivilegesTable('Campaigns', 'campaign_timeline_channels')}" campaign_timeline_chanels="${getPrivilegesTable('Campaigns', 'campaign_timeline_chanels')}" campaign_timeline_chanel_players="${getPrivilegesTable('Campaigns', 'campaign_timeline_chanel_players')}" campaign_timeline_board_viewer_channels="${getPrivilegesTable('Campaigns', 'campaign_timeline_board_viewer_channels')}" campaign_timeline_board_viewer_chanels="${getPrivilegesTable('Campaigns', 'campaign_timeline_board_viewer_chanels')}" campaign_timeline_board_templates="${getPrivilegesTable('Campaigns', 'campaign_timeline_board_templates')}" campaign_channels="${getPrivilegesTable('Campaigns', 'campaign_channels')}" campaign_channel_players="${getPrivilegesTable('Campaigns', 'campaign_channel_players')}" campaign_boards="${getPrivilegesTable('Campaigns', 'campaign_boards')}"/>
                </Group>
                <Group name="Transitions" visible="${getAttributeGroup('Transitions', 'visible')}">
                  <Tables transition_pools="${getPrivilegesTable('Transitions', 'transition_pools')}" transition_pool_items="${getPrivilegesTable('Transitions', 'transition_pool_items')}"/>
                </Group>
                <Group name="Scripts" visible="${getAttributeGroup('Scripts', 'visible')}">
                  <Tables scripts="${getPrivilegesTable('Scripts', 'scripts')}"/>
                </Group>
                <Group name="AdLocal" visible="${getAttributeGroup('AdLocal', 'visible')}">
                  <Tables ad_local_packages="${getPrivilegesTable('AdLocal', 'ad_local_packages')}" ad_local_contents="${getPrivilegesTable('AdLocal', 'ad_local_contents')}"/>
                </Group>
                <Group name="AdOut" visible="${getAttributeGroup('AdOut', 'visible')}" globalSearch="${getAttributeGroup('AdOut', 'globalSearch')}">
                  <Tables ad_out_packages="${getPrivilegesTable('AdOut', 'ad_out_packages')}" ad_out_package_stations="${getPrivilegesTable('AdOut', 'ad_out_package_stations')}" ad_out_package_contents="${getPrivilegesTable('AdOut', 'ad_out_package_contents')}"/>
                </Group>
                <Group name="AdIn" visible="${getAttributeGroup('AdIn', 'visible')}">
                  <Tables ad_in_domains="${getPrivilegesTable('AdIn', 'ad_in_domains')}" ad_in_domain_businesses="${getPrivilegesTable('AdIn', 'ad_in_domain_businesses')}" ad_in_domain_business_packages="${getPrivilegesTable('AdIn', 'ad_in_domain_business_packages')}" ad_in_domain_business_package_stations="${getPrivilegesTable('AdIn', 'ad_in_domain_business_package_stations')}" ad_rates="${getPrivilegesTable('AdIn', 'ad_rates')}"/>
                </Group>
                <Group name="AdRate" visible="${getAttributeGroup('AdRate', 'visible')}">
                  <Tables ad_rates="${getPrivilegesTable('AdRate', 'ad_rates')}"/>
                </Group>
                <Group name="AdAnalytic" visible="${getAttributeGroup('AdAnalytic', 'visible')}">
                  <Tables/>
                </Group>
                <Group name="Music" visible="${getAttributeGroup('Music', 'visible')}">
                  <Tables music_channels="${getPrivilegesTable('Music', 'music_channels')}" music_channel_songs="${getPrivilegesTable('Music', 'music_channel_songs')}"/>
                </Group>
                <Group name="Stations" visible="${getAttributeGroup('Stations', 'visible')}" stationsNetwork="${getAttributeGroup('Stations', 'stationsNetwork')}" updateOnSave="${getAttributeGroup('Stations', 'updateOnSave')}" lanServer="${getAttributeGroup('Stations', 'lanServer')}" zwave="${getAttributeGroup('Stations', 'zwave')}">
                  <Tables branch_stations="${getPrivilegesTable('Stations', 'branch_stations')}" station_ads="${getPrivilegesTable('Stations', 'station_ads')}"/>
                </Group>
                <Group name="Changelist" visible="${getAttributeGroup('Changelist', 'visible')}">
                  <Tables/>
                </Group>
              </Groups>
        </Privilege>
        `

        if (_.isNull(appStore)) {
            // mode 1: generate object from XML (we don't care about values as this is just a template)
            parseString(xmlData, {attrkey: '_attr'}, function (err, result) {
                callBack(err, result);
            });
        } else {
            // mode 2: generate raw XML with real user data from appStore so we can serialize and save to server
            callBack(null, xmlData);
        }

    }

    static AppsXmlTemplate(callBack:(err, result)=>any) {
        const parseString = require('xml2js').parseString;
        var xmlData = `
                <Apps>
                  <App id="10145" appName="Webkit" helpName="" uninstallable="1" hidden="0" price="0">
                    <Description>Webkit</Description>
                    <Components>
                      <Component moduleId="3415" componentName="Webkit" version="1911" moduleWeb="Players/Standard/BlockWebkitPlayerWeb.swf" moduleAir="Players/Standard/BlockWebkitPlayerDesktop.swf" moduleMobile="Players/Standard/BlockWebkitPlayerMobile.swf" showInTimeline="1" showInScene="1"/>
                    </Components>
                  </App>
                  <App id="10500" appName="Label Queue" helpName="" uninstallable="1" hidden="0" price="0">
                    <Description>Label Queue</Description>
                    <Components>
                      <Component moduleId="3242" componentName="LabelQueue" version="1911" moduleWeb="Players/Standard/BlockLabelQueuePlayer.swf" moduleAir="" moduleMobile="" showInTimeline="1" showInScene="1"/>
                    </Components>
                  </App>
                  <App id="12100" appName="FasterQ" helpName="" uninstallable="1" hidden="0" price="0">
                    <Description>FasterQ</Description>
                    <Components>
                      <Component moduleId="6100" componentName="FasterQ" version="1911" moduleWeb="Players/Standard/BlockWebkitPlayerWeb.swf" moduleAir="Players/Standard/BlockWebkitPlayerDesktop.swf" moduleMobile="Players/Standard/BlockWebkitPlayerMobile.swf" showInTimeline="1" showInScene="1" componentParams="{&quot;url&quot;:&quot;http://galaxy.signage.me/code/html/fasterq.json&quot;}"/>
                    </Components>
                  </App>
                  <App id="12010" appName="World weather" helpName="" uninstallable="1" hidden="0" price="0">
                    <Description>Weather</Description>
                    <Components>
                      <Component moduleId="6010" componentName="World weather" version="1911" moduleWeb="Players/Standard/BlockJsonPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="1" showInScene="1" componentParams="{&quot;url&quot;:&quot;https://secure.digitalsignage.com/Weather&quot;}">
                        <MimeTypes>
                          <MimeType name="Json" providerType="weather" label="World weather"/>
                        </MimeTypes>
                      </Component>
                    </Components>
                  </App>
                  <App id="10140" appName="Ext Application" helpName="" uninstallable="1" hidden="0" price="0">
                    <Description>Ext Application</Description>
                    <Components>
                      <Component moduleId="3410" componentName="Ext Application" version="1911" moduleWeb="Players/Standard/BlockExtAppPlayerWeb.swf" moduleAir="Players/Standard/BlockExtAppPlayerAir.swf" moduleMobile="" showInTimeline="1" showInScene="0"/>
                    </Components>
                  </App>
                  <App id="10050" appName="Rss Text" helpName="" uninstallable="0" hidden="0" price="0">
                    <Description>Rss Text</Description>
                    <Components>
                      <Component moduleId="3345" componentName="Rss Text" version="1911" moduleWeb="Players/Standard/BlockRssTextPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="1" showInScene="1"/>
                    </Components>
                  </App>
                  <App id="10400" appName="Message" helpName="" uninstallable="1" hidden="0" price="0">
                    <Description>Message</Description>
                    <Components>
                      <Component moduleId="3245" componentName="Message" version="1911" moduleWeb="Players/Standard/BlockMessagePlayer.swf" moduleAir="" moduleMobile="" showInTimeline="1" showInScene="1"/>
                    </Components>
                  </App>
                  <App id="12090" appName="Pinterest" helpName="" uninstallable="1" hidden="0" price="0">
                    <Description>Pinterest</Description>
                    <Components>
                      <Component moduleId="6080" componentName="Pinterest" version="1911" moduleWeb="Players/Standard/BlockJsonPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="1" showInScene="1" componentParams="{&quot;url&quot;:&quot;https://secure.digitalsignage.com/PinterestUserPins&quot;}">
                        <MimeTypes>
                          <MimeType name="Json" providerType="pinterest.board" label="Pinterest board"/>
                          <MimeType name="Json" providerType="pinterest.user" label="Pinterest user"/>
                        </MimeTypes>
                      </Component>
                    </Components>
                  </App>
                  <App id="12000" appName="Digg" helpName="" uninstallable="1" hidden="0" price="0">
                    <Description>Digg</Description>
                    <Components>
                      <Component moduleId="6000" componentName="Digg" version="1911" moduleWeb="Players/Standard/BlockJsonPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="1" showInScene="1" componentParams="{&quot;url&quot;:&quot;https://secure.digitalsignage.com/Digg&quot;}">
                        <MimeTypes>
                          <MimeType name="Json" providerType="digg" label="Digg"/>
                        </MimeTypes>
                      </Component>
                    </Components>
                  </App>
                  <App id="10130" appName="Grid/Chart" helpName="" uninstallable="1" hidden="0" price="0">
                    <Description>Grid/Chart</Description>
                    <Components>
                      <Component moduleId="3400" componentName="Grid/Chart" version="1911" moduleWeb="Players/Standard/BlockChartPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="1" showInScene="1"/>
                    </Components>
                  </App>
                  <App id="10040" appName="Html" helpName="" uninstallable="0" hidden="0" price="0">
                    <Description>Html</Description>
                    <Components>
                      <Component moduleId="3235" componentName="Html" version="1911" moduleWeb="Players/Standard/BlockHtmlPlayerWeb.swf" moduleAir="Players/Standard/BlockHtmlPlayerAir.swf" moduleMobile="Players/Standard/BlockHtmlPlayerMobile.swf" showInTimeline="1" showInScene="1"/>
                    </Components>
                  </App>
                  <App id="12260" appName="Mashape" helpName="" uninstallable="1" hidden="0" price="0">
                    <Description>Mashape</Description>
                    <Components>
                      <Component moduleId="6260" componentName="Mashape" version="1911" moduleWeb="Players/Standard/BlockJsonPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="1" showInScene="1" componentParams="{&quot;url&quot;:&quot;https://secure.digitalsignage.com&quot;}">
                        <MimeTypes>
                          <MimeType name="Json" providerType="mashape.randomQuote" label="Mashape movie quotes"/>
                          <MimeType name="Json" providerType="mashape.currency" label="Mashape currency exchange"/>
                          <MimeType name="Json" providerType="mashape.btc" label="Mashape bitcoin rate"/>
                        </MimeTypes>
                      </Component>
                    </Components>
                  </App>
                  <App id="12080" appName="500px" helpName="" uninstallable="1" hidden="0" price="0">
                    <Description>500px</Description>
                    <Components>
                      <Component moduleId="6070" componentName="500px" version="1911" moduleWeb="Players/Standard/BlockJsonPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="1" showInScene="1" componentParams="{&quot;url&quot;:&quot;https://secure.digitalsignage.com/500pxPhotos&quot;}">
                        <MimeTypes>
                          <MimeType name="Json" providerType="500px.collection" label="500px collection"/>
                          <MimeType name="Json" providerType="500px.user" label="500px user"/>
                        </MimeTypes>
                      </Component>
                    </Components>
                  </App>
                  <App id="10210" appName="Twitter" helpName="" uninstallable="1" hidden="0" price="0">
                    <Description>Twitter</Description>
                    <Components>
                      <Component moduleId="4505" componentName="Twitter Item" version="1911" moduleWeb="Players/Standard/BlockTwitterItemPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="0" showInScene="1"/>
                      <Component moduleId="4500" componentName="Twitter Player" version="1911" moduleWeb="Players/Standard/BlockTwitterPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="1" showInScene="1"/>
                    </Components>
                  </App>
                  <App id="10120" appName="Clock" helpName="" uninstallable="1" hidden="0" price="0">
                    <Description>Clock</Description>
                    <Components>
                      <Component moduleId="3320" componentName="Clock" version="1911" moduleWeb="Players/Standard/BlockClockPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="1" showInScene="1"/>
                    </Components>
                  </App>
                  <App id="10030" appName="Label" helpName="" uninstallable="0" hidden="0" price="0">
                    <Description>Label</Description>
                    <Components>
                      <Component moduleId="3241" componentName="Label" version="1911" moduleWeb="Players/Standard/BlockLabelPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="1" showInScene="1"/>
                      <Component moduleId="3240" componentName="RichText" version="1911" moduleWeb="Players/Standard/BlockRichTextPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="1" showInScene="1"/>
                    </Components>
                  </App>
                  <App id="12250" appName="Etsy" helpName="" uninstallable="1" hidden="0" price="0">
                    <Description>Etsy</Description>
                    <Components>
                      <Component moduleId="6250" componentName="Etsy" version="1911" moduleWeb="Players/Standard/BlockJsonPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="1" showInScene="1" componentParams="{&quot;url&quot;:&quot;https://secure.digitalsignage.com&quot;}">
                        <MimeTypes>
                          <MimeType name="Json" providerType="etsy.userProfile" label="Etsy user profile"/>
                          <MimeType name="Json" providerType="etsy.shopAbout" label="Etsy shop about"/>
                          <MimeType name="Json" providerType="etsy.shopListings" label="Etsy shop listings"/>
                        </MimeTypes>
                      </Component>
                    </Components>
                  </App>
                  <App id="12070" appName="Google drive" helpName="" uninstallable="1" hidden="0" price="0">
                    <Description>Google drive</Description>
                    <Components>
                      <Component moduleId="6060" componentName="Google drive" version="1911" moduleWeb="Players/Standard/BlockJsonPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="1" showInScene="1" componentParams="{&quot;url&quot;:&quot;https://secure.digitalsignage.com/GoogleAjaxFileLink/&quot;}">
                        <MimeTypes>
                          <MimeType name="Json" providerType="drive" label="Google drive"/>
                        </MimeTypes>
                      </Component>
                    </Components>
                  </App>
                  <App id="10220" appName="YouTube" helpName="" uninstallable="1" hidden="0" price="0">
                    <Description>YouTube</Description>
                    <Components>
                      <Component moduleId="4600" componentName="YouTube" version="1911" moduleWeb="Players/Standard/BlockYouTubePlayerWeb.swf" moduleAir="" moduleMobile="" showInTimeline="1" showInScene="1"/>
                    </Components>
                  </App>
                  <App id="11000" appName="Browser" helpName="" uninstallable="1" hidden="0" price="0">
                    <Description>Browser</Description>
                    <Components>
                      <Component moduleId="5500" componentName="Browser" version="1911" moduleWeb="Players/Standard/BlockWebkitPlayerWeb.swf" moduleAir="Players/Standard/BlockWebkitPlayerDesktop.swf" moduleMobile="Players/Standard/BlockWebkitPlayerMobile.swf" showInTimeline="1" showInScene="1" componentParams="{&quot;url&quot;:&quot;http://galaxy.signage.me/code/html/browser.json&quot;}"/>
                    </Components>
                  </App>
                  <App id="10020" appName="External Resource" helpName="" uninstallable="0" hidden="0" price="0">
                    <Description>External Resource</Description>
                    <Components>
                      <Component moduleId="3160" componentName="External swf/image" version="1911" moduleWeb="Players/Standard/BlockLinkedSwfPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="1" showInScene="1"/>
                      <Component moduleId="3150" componentName="External video" version="1911" moduleWeb="Players/Standard/BlockLinkedVideoPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="1" showInScene="1"/>
                    </Components>
                  </App>
                  <App id="10195" appName="JSON Player" helpName="" uninstallable="1" hidden="0" price="0">
                    <Description>JSON Player</Description>
                    <Components>
                      <Component moduleId="4310" componentName="JsonItem" version="1911" moduleWeb="Players/Standard/BlockJsonItemPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="0" showInScene="1"/>
                      <Component moduleId="4300" componentName="JsonPlayer" version="1911" moduleWeb="Players/Standard/BlockJsonPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="1" showInScene="1"/>
                    </Components>
                  </App>
                  <App id="12230" appName="Twitter" helpName="" uninstallable="1" hidden="0" price="0">
                    <Description>Twitter</Description>
                    <Components>
                      <Component moduleId="6230" componentName="Twitter" version="1911" moduleWeb="Players/Standard/BlockJsonPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="1" showInScene="1" componentParams="{&quot;url&quot;:&quot;https://secure.digitalsignage.com&quot;}">
                        <MimeTypes>
                          <MimeType name="Json" providerType="twitter" label="Twitter"/>
                        </MimeTypes>
                      </Component>
                    </Components>
                  </App>
                  <App id="12240" appName="Yelp" helpName="" uninstallable="1" hidden="0" price="0">
                    <Description>Yelp</Description>
                    <Components>
                      <Component moduleId="6240" componentName="Yelp" version="1911" moduleWeb="Players/Standard/BlockJsonPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="1" showInScene="1" componentParams="{&quot;url&quot;:&quot;https://secure.digitalsignage.com&quot;}">
                        <MimeTypes>
                          <MimeType name="Json" providerType="yelp.reviews" label="Yelp reviews"/>
                          <MimeType name="Json" providerType="yelp.info" label="Yelp info"/>
                        </MimeTypes>
                      </Component>
                    </Components>
                  </App>
                  <App id="12060" appName="Instagram" helpName="" uninstallable="1" hidden="0" price="0">
                    <Description>Instagram</Description>
                    <Components>
                      <Component moduleId="6050" componentName="Instagram" version="1911" moduleWeb="Players/Standard/BlockJsonPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="1" showInScene="1" componentParams="{&quot;url&quot;:&quot;https://secure.digitalsignage.com/InstagramFeed&quot;}">
                        <MimeTypes>
                          <MimeType name="Json" providerType="instagram.feed" label="Instagram feed"/>
                          <MimeType name="Json" providerType="instagram.media" label="Instagram media"/>
                        </MimeTypes>
                      </Component>
                    </Components>
                  </App>
                  <App id="10190" appName="XML Player" helpName="" uninstallable="1" hidden="0" price="0">
                    <Description>XML Player</Description>
                    <Components>
                      <Component moduleId="4210" componentName="XmlItem" version="1911" moduleWeb="Players/Standard/BlockXmlItemPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="0" showInScene="1"/>
                      <Component moduleId="4200" componentName="XmlPlayer" version="1911" moduleWeb="Players/Standard/BlockXmlPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="1" showInScene="1"/>
                    </Components>
                  </App>
                  <App id="10100" appName="Catalog" helpName="" uninstallable="0" hidden="0" price="0">
                    <Description>Catalog</Description>
                    <Components>
                      <Component moduleId="3270" componentName="Catalog item" version="1911" moduleWeb="Players/Standard/BlockItemPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="0" showInScene="1"/>
                      <Component moduleId="3280" componentName="Catalog player" version="1911" moduleWeb="Players/Standard/BlockCatalogPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="1" showInScene="0">
                        <MimeTypes>
                          <MimeType name="Catalog" label="Catalog"/>
                        </MimeTypes>
                      </Component>
                    </Components>
                  </App>
                  <App id="10010" appName="Scene" helpName="" uninstallable="0" hidden="1" price="0">
                    <Description>Scene</Description>
                    <Components>
                      <Component moduleId="3511" componentName="DesignerEditor" version="1911" moduleWeb="Players/Standard/DesignerEditor.swf" moduleAir="" moduleMobile="" showInTimeline="0" showInScene="0"/>
                      <Component moduleId="3510" componentName="DesignerPlayer" version="1911" moduleWeb="Players/Standard/DesignerPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="0" showInScene="0"/>
                    </Components>
                  </App>
                  <App id="12210" appName="Dropbox" helpName="" uninstallable="1" hidden="0" price="0">
                    <Description>Dropbox</Description>
                    <Components>
                      <Component moduleId="6210" componentName="Dropbox" version="1911" moduleWeb="Players/Standard/BlockJsonPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="1" showInScene="1" componentParams="{&quot;url&quot;:&quot;https://secure.digitalsignage.com&quot;}">
                        <MimeTypes>
                          <MimeType name="Json" providerType="dropbox" label="Dropbox"/>
                        </MimeTypes>
                      </Component>
                    </Components>
                  </App>
                  <App id="10185" appName="Location based" helpName="" uninstallable="1" hidden="0" price="0">
                    <Description>Location based</Description>
                    <Components>
                      <Component moduleId="4105" componentName="LocationBasedPlayer" version="1911" moduleWeb="Players/Standard/BlockLocationBasedPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="1" showInScene="1"/>
                    </Components>
                  </App>
                  <App id="10005" appName="Embeded Resource" helpName="" uninstallable="0" hidden="1" price="0">
                    <Description>Embeded Resource</Description>
                    <Components>
                      <Component moduleId="3130" componentName="Swf" version="1911" moduleWeb="Players/Standard/BlockSwfPlayer.swf" moduleAir="Players/Standard/BlockSwfPlayerDesktop.swf" moduleMobile="Players/Standard/BlockSwfPlayerMobile.swf" showInTimeline="0" showInScene="0"/>
                      <Component moduleId="3140" componentName="Svg" version="1911" moduleWeb="Players/Standard/BlockSvgPlayer.swf" moduleAir="Players/Standard/BlockSvgPlayer.swf" moduleMobile="Players/Standard/BlockSvgPlayer.swf" showInTimeline="0" showInScene="0"/>
                      <Component moduleId="3100" componentName="Video" version="1911" moduleWeb="Players/Standard/VideoPlayer.swf" moduleAir="" moduleMobile="Players/Standard/BlockVideoPlayerMobile.swf" showInTimeline="0" showInScene="0"/>
                    </Components>
                  </App>
                  <App id="12050" appName="Picasa" helpName="" uninstallable="1" hidden="0" price="0">
                    <Description>Picasa</Description>
                    <Components>
                      <Component moduleId="6040" componentName="Picasa" version="1911" moduleWeb="Players/Standard/BlockJsonPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="1" showInScene="1" componentParams="{&quot;url&quot;:&quot;https://secure.digitalsignage.com/GooglePicasa&quot;}">
                        <MimeTypes>
                          <MimeType name="Json" providerType="picasa" label="Picasa"/>
                        </MimeTypes>
                      </Component>
                    </Components>
                  </App>
                  <App id="10180" appName="CollectionViewer" helpName="" uninstallable="1" hidden="0" price="0">
                    <Description>CollectionViewer</Description>
                    <Components>
                      <Component moduleId="4100" componentName="CollectionPlayer" version="1911" moduleWeb="Players/Standard/BlockCollectionPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="1" showInScene="1"/>
                    </Components>
                  </App>
                  <App id="10090" appName="Stock" helpName="" uninstallable="0" hidden="0" price="0">
                    <Description>Stock</Description>
                    <Components>
                      <Component moduleId="3338" componentName="Stock player" version="1911" moduleWeb="Players/Standard/BlockStockTickerPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="1" showInScene="0">
                        <MimeTypes>
                          <MimeType name="Stocks" label="Stocks"/>
                        </MimeTypes>
                      </Component>
                      <Component moduleId="3335" componentName="Stock item" version="1911" moduleWeb="Players/Standard/BlockStockItemPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="0" showInScene="1"/>
                    </Components>
                  </App>
                  <App id="10122" appName="Countdown" helpName="" uninstallable="1" hidden="0" price="0">
                    <Description>Countdown</Description>
                    <Components>
                      <Component moduleId="3322" componentName="Countdown" version="1911" moduleWeb="Players/Standard/BlockCountdownPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="1" showInScene="1"/>
                    </Components>
                  </App>
                  <App id="10300" appName="Form" helpName="" uninstallable="1" hidden="0" price="0">
                    <Description>Form</Description>
                    <Components>
                      <Component moduleId="3600" componentName="Form" version="1911" moduleWeb="Players/Standard/BlockFormPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="0" showInScene="1"/>
                    </Components>
                  </App>
                  <App id="12220" appName="Flickr" helpName="" uninstallable="1" hidden="0" price="0">
                    <Description>Flickr</Description>
                    <Components>
                      <Component moduleId="6220" componentName="Flickr" version="1911" moduleWeb="Players/Standard/BlockJsonPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="1" showInScene="1" componentParams="{&quot;url&quot;:&quot;https://secure.digitalsignage.com&quot;}">
                        <MimeTypes>
                          <MimeType name="Json" providerType="flickr" label="Flickr"/>
                        </MimeTypes>
                      </Component>
                    </Components>
                  </App>
                  <App id="12040" appName="Google plus" helpName="" uninstallable="1" hidden="0" price="0">
                    <Description>Google plus</Description>
                    <Components>
                      <Component moduleId="6030" componentName="Google plus" version="1911" moduleWeb="Players/Standard/BlockJsonPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="1" showInScene="1" componentParams="{&quot;url&quot;:&quot;https://secure.digitalsignage.com/GooglePlusActivities&quot;}">
                        <MimeTypes>
                          <MimeType name="Json" providerType="plus" label="Google plus"/>
                        </MimeTypes>
                      </Component>
                    </Components>
                  </App>
                  <App id="10080" appName="Weather" helpName="" uninstallable="0" hidden="0" price="0">
                    <Description>Weather</Description>
                    <Components>
                      <Component moduleId="3315" componentName="Weather item" version="1911" moduleWeb="Players/Standard/BlockItemWeatherPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="0" showInScene="1"/>
                      <Component moduleId="3310" componentName="Weather player" version="1911" moduleWeb="Players/Standard/BlockRssWeatherPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="1" showInScene="0">
                        <MimeTypes>
                          <MimeType name="Weather" label="Weather"/>
                        </MimeTypes>
                      </Component>
                    </Components>
                  </App>
                  <App id="12032" appName="Google Sheets" helpName="" uninstallable="1" hidden="0" price="0">
                    <Description>Google Sheets</Description>
                    <Components>
                      <Component moduleId="6022" componentName="Google Sheets" version="1911" moduleWeb="Players/Standard/BlockJsonPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="1" showInScene="1" componentParams="{&quot;url&quot;:&quot;https://secure.digitalsignage.com/GoogleSheetsValues&quot;}">
                        <MimeTypes>
                          <MimeType name="Json" providerType="spreadsheet" label="Google Spreadsheet"/>
                        </MimeTypes>
                      </Component>
                    </Components>
                  </App>
                  <App id="12030" appName="Google calendar" helpName="" uninstallable="1" hidden="0" price="0">
                    <Description>Google calendar</Description>
                    <Components>
                      <Component moduleId="6020" componentName="Google calendar" version="1911" moduleWeb="Players/Standard/BlockJsonPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="1" showInScene="1" componentParams="{&quot;url&quot;:&quot;https://secure.digitalsignage.com/GoogleCalendarEvents&quot;}">
                        <MimeTypes>
                          <MimeType name="Json" providerType="calendar" label="Google calendar"/>
                        </MimeTypes>
                      </Component>
                    </Components>
                  </App>
                  <App id="10160" appName="QR Code" helpName="" uninstallable="1" hidden="0" price="0">
                    <Description>QR Code</Description>
                    <Components>
                      <Component moduleId="3430" componentName="QR Code" version="1911" moduleWeb="Players/Standard/BlockQRCodePlayer.swf" moduleAir="" moduleMobile="" showInTimeline="1" showInScene="1"/>
                    </Components>
                  </App>
                  <App id="10070" appName="Media Rss/Podcast" helpName="" uninstallable="0" hidden="0" price="0">
                    <Description>Media Rss/Podcast</Description>
                    <Components>
                      <Component moduleId="3340" componentName="Media Rss/Podcast" version="1911" moduleWeb="Players/Standard/BlockRssVideoPlayerWeb.swf" moduleAir="Players/Standard/BlockRssVideoPlayerAir.swf" moduleMobile="" showInTimeline="1" showInScene="1"/>
                    </Components>
                  </App>
                  <App id="10110" appName="Capture/Camera" helpName="" uninstallable="1" hidden="0" price="0">
                    <Description>Capture/Camera</Description>
                    <Components>
                      <Component moduleId="3350" componentName="Capture/Camera" version="1911" moduleWeb="Players/Standard/BlockCameraPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="1" showInScene="1"/>
                    </Components>
                  </App>
                  <App id="12200" appName="Tumblr" helpName="" uninstallable="1" hidden="0" price="0">
                    <Description>Tumblr</Description>
                    <Components>
                      <Component moduleId="6090" componentName="Tumblr" version="1911" moduleWeb="Players/Standard/BlockJsonPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="1" showInScene="1" componentParams="{&quot;url&quot;:&quot;https://secure.digitalsignage.com/TumblrUserInfo&quot;}">
                        <MimeTypes>
                          <MimeType name="Json" providerType="tumblr.texts" label="Tumblr texts"/>
                          <MimeType name="Json" providerType="tumblr.photos" label="Tumblr photos"/>
                          <MimeType name="Json" providerType="tumblr.videos" label="Tumblr videos"/>
                          <MimeType name="Json" providerType="tumblr.posts" label="Tumblr posts"/>
                        </MimeTypes>
                      </Component>
                    </Components>
                  </App>
                  <App id="12020" appName="Facebook" helpName="" uninstallable="1" hidden="0" price="0">
                    <Description>Facebook</Description>
                    <Components>
                      <Component moduleId="4400" componentName="Facebook" version="1911" moduleWeb="Players/Standard/BlockJsonPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="1" showInScene="1" componentParams="{&quot;url&quot;:&quot;https://secure.digitalsignage.com/facebook&quot;}">
                        <MimeTypes>
                          <MimeType name="Json" providerType="facebook.videos" label="Facebook videos"/>
                          <MimeType name="Json" providerType="facebook.wall" label="Facebook wall"/>
                          <MimeType name="Json" providerType="facebook.album" label="Facebook album"/>
                        </MimeTypes>
                      </Component>
                    </Components>
                  </App>
                  <App id="10150" appName="AdNet" helpName="" uninstallable="1" hidden="0" price="0">
                    <Description>AdNet</Description>
                    <Components>
                      <Component moduleId="3420" componentName="AdNet" version="1911" moduleWeb="Players/Standard/BlockAdNetPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="1" showInScene="0"/>
                    </Components>
                  </App>
                  <App id="10060" appName="Custom Rss" helpName="" uninstallable="0" hidden="0" price="0">
                    <Description>Custom Rss</Description>
                    <Components>
                      <Component moduleId="3348" componentName="Custom Rss item" version="1911" moduleWeb="Players/Standard/BlockCustomRssItemPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="0" showInScene="1"/>
                      <Component moduleId="3346" componentName="Custom Rss player" version="1911" moduleWeb="Players/Standard/BlockCustomRssPlayer.swf" moduleAir="" moduleMobile="" showInTimeline="1" showInScene="0">
                        <MimeTypes>
                          <MimeType name="CustomRss" label="CustomRss"/>
                        </MimeTypes>
                      </Component>
                    </Components>
                  </App>
                </Apps>
        `

        parseString(xmlData, {attrkey: '_attr'}, function (err, result) {
            callBack(err, result);
        });
    }

    static LoadComponentAsync(name:string, path:string) {

        return System.import(path).then(c => c[name]);

        //return System.import('/dist/public/out.js')
        //    .catch(function (e) {
        //        alert('prob loading out.js ' + e);
        //    }).then(function (e) {
        //        alert(e);
        //        alert(e[name]);
        //        alert(JSON.stringify(e));
        //        return System.import('App1').then(c => c[name]);
        //    });
    }


    static ConstructImmutableFromTable(path):Array<any> {
        var arr = [];
        path.forEach((member)=> {
            var obj = {};
            obj[member._attr.name] = {
                table: {}
            }
            for (var k in member._attr) {
                var value = member._attr[k]
                obj[member._attr.name][k] = value;
                for (var t in member.Tables["0"]._attr) {
                    var value = member.Tables["0"]._attr[t]
                    obj[member._attr.name]['table'][t] = value;
                }
            }
            arr.push(Immutable.fromJS(obj));
        });
        return arr;
    }

    static ComputeAccessMask(accessMask):number {
        var bits = [1, 2, 4, 8, 16, 32, 64, 128];
        var computedAccessMask = 0;
        accessMask.forEach(value=> {
            var bit = bits.shift();
            if (value)
                computedAccessMask = computedAccessMask + bit;

        })
        return computedAccessMask;
    }

    static GetAccessMask(accessMask):List<any> {
        var checks = List();
        var bits = [1, 2, 4, 8, 16, 32, 64, 128];
        for (var i = 0; i < bits.length; i++) {
            let checked = (bits[i] & accessMask) > 0 ? true : false;
            checks = checks.push(checked)
        }
        return checks;
        // bits.forEach((bit, idx) => {
        //     let checked = (bit & accessMask) > 0 ? true : false;
        //     var checkBox = {
        //         'name': idx,
        //         'value': idx,
        //         'checked': checked
        //     }
        //     checks = checks.push(checked)
        // })
    }

    static log(msg) {
        console.log(new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1") + ': ' + msg);
    }

    static guid():string {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    static ReduxLoggerMiddleware = store => next => action => {
        // console.log("dispatching", action.type);
        let result = next(action);
        //console.log("next state", store.getState());
        return result
    };

    static Xml2Json() {
        //https://github.com/metatribal/xmlToJSON
        var xmlToJSON = (function () {

            this.version = "1.3";

            var options = { // set up the default options
                mergeCDATA: true, // extract cdata and merge with text
                grokAttr: true, // convert truthy attributes to boolean, etc
                grokText: true, // convert truthy text/attr to boolean, etc
                normalize: true, // collapse multiple spaces to single space
                xmlns: true, // include namespaces as attribute in output
                namespaceKey: '_ns', // tag name for namespace objects
                textKey: '_text', // tag name for text nodes
                valueKey: '_value', // tag name for attribute values
                attrKey: '_attr', // tag for attr groups
                cdataKey: '_cdata', // tag for cdata nodes (ignored if mergeCDATA is true)
                attrsAsObject: true, // if false, key is used as prefix to name, set prefix to '' to merge children and attrs.
                stripAttrPrefix: true, // remove namespace prefixes from attributes
                stripElemPrefix: true, // for elements of same name in diff namespaces, you can enable namespaces and access the nskey property
                childrenAsArray: true // force children into arrays
            };

            var prefixMatch:any = new RegExp('(?!xmlns)^.*:/');
            var trimMatch:any = new RegExp('^\s+|\s+$g');

            this.grokType = function (sValue) {
                if (/^\s*$/.test(sValue)) {
                    return null;
                }
                if (/^(?:true|false)$/i.test(sValue)) {
                    return sValue.toLowerCase() === "true";
                }
                if (isFinite(sValue)) {
                    return parseFloat(sValue);
                }
                return sValue;
            };

            this.parseString = function (xmlString, opt) {
                return this.parseXML(this.stringToXML(xmlString), opt);
            }

            this.parseXML = function (oXMLParent, opt) {

                // initialize options
                for (var key in opt) {
                    options[key] = opt[key];
                }

                var vResult = {},
                    nLength = 0,
                    sCollectedTxt = "";

                // parse namespace information
                if (options.xmlns && oXMLParent.namespaceURI) {
                    vResult[options.namespaceKey] = oXMLParent.namespaceURI;
                }

                // parse attributes
                // using attributes property instead of hasAttributes method to support older browsers
                if (oXMLParent.attributes && oXMLParent.attributes.length > 0) {
                    var vAttribs = {};

                    for (nLength; nLength < oXMLParent.attributes.length; nLength++) {
                        var oAttrib = oXMLParent.attributes.item(nLength);
                        vContent = {};
                        var attribName = '';

                        if (options.stripAttrPrefix) {
                            attribName = oAttrib.name.replace(prefixMatch, '');

                        } else {
                            attribName = oAttrib.name;
                        }

                        if (options.grokAttr) {
                            vContent[options.valueKey] = this.grokType(oAttrib.value.replace(trimMatch, ''));
                        } else {
                            vContent[options.valueKey] = oAttrib.value.replace(trimMatch, '');
                        }

                        if (options.xmlns && oAttrib.namespaceURI) {
                            vContent[options.namespaceKey] = oAttrib.namespaceURI;
                        }

                        if (options.attrsAsObject) { // attributes with same local name must enable prefixes
                            vAttribs[attribName] = vContent;
                        } else {
                            vResult[options.attrKey + attribName] = vContent;
                        }
                    }

                    if (options.attrsAsObject) {
                        vResult[options.attrKey] = vAttribs;
                    } else {
                    }
                }

                // iterate over the children
                if (oXMLParent.hasChildNodes()) {
                    for (var oNode, sProp, vContent, nItem = 0; nItem < oXMLParent.childNodes.length; nItem++) {
                        oNode = oXMLParent.childNodes.item(nItem);

                        if (oNode.nodeType === 4) {
                            if (options.mergeCDATA) {
                                sCollectedTxt += oNode.nodeValue;
                            } else {
                                if (vResult.hasOwnProperty(options.cdataKey)) {
                                    if (vResult[options.cdataKey].constructor !== Array) {
                                        vResult[options.cdataKey] = [vResult[options.cdataKey]];
                                    }
                                    vResult[options.cdataKey].push(oNode.nodeValue);

                                } else {
                                    if (options.childrenAsArray) {
                                        vResult[options.cdataKey] = [];
                                        vResult[options.cdataKey].push(oNode.nodeValue);
                                    } else {
                                        vResult[options.cdataKey] = oNode.nodeValue;
                                    }
                                }
                            }
                        } /* nodeType is "CDATASection" (4) */
                        else if (oNode.nodeType === 3) {
                            sCollectedTxt += oNode.nodeValue;
                        } /* nodeType is "Text" (3) */
                        else if (oNode.nodeType === 1) { /* nodeType is "Element" (1) */

                            if (nLength === 0) {
                                vResult = {};
                            }

                            // using nodeName to support browser (IE) implementation with no 'localName' property
                            if (options.stripElemPrefix) {
                                sProp = oNode.nodeName.replace(prefixMatch, '');
                            } else {
                                sProp = oNode.nodeName;
                            }

                            vContent = xmlToJSON.parseXML(oNode);

                            if (vResult.hasOwnProperty(sProp)) {
                                if (vResult[sProp].constructor !== Array) {
                                    vResult[sProp] = [vResult[sProp]];
                                }
                                vResult[sProp].push(vContent);

                            } else {
                                if (options.childrenAsArray) {
                                    vResult[sProp] = [];
                                    vResult[sProp].push(vContent);
                                } else {
                                    vResult[sProp] = vContent;
                                }
                                nLength++;
                            }
                        }
                    }
                } else if (!sCollectedTxt) { // no children and no text, return null
                    if (options.childrenAsArray) {
                        vResult[options.textKey] = [];
                        vResult[options.textKey].push(null);
                    } else {
                        vResult[options.textKey] = null;
                    }
                }

                if (sCollectedTxt) {
                    if (options.grokText) {
                        var value = this.grokType(sCollectedTxt.replace(trimMatch, ''));
                        if (value !== null && value !== undefined) {
                            vResult[options.textKey] = value;
                        }
                    } else if (options.normalize) {
                        vResult[options.textKey] = sCollectedTxt.replace(trimMatch, '').replace(/\s+/g, " ");
                    } else {
                        vResult[options.textKey] = sCollectedTxt.replace(trimMatch, '');
                    }
                }

                return vResult;
            }


            // Convert xmlDocument to a string
            // Returns null on failure
            this.xmlToString = function (xmlDoc) {
                try {
                    var xmlString = xmlDoc.xml ? xmlDoc.xml : (new XMLSerializer()).serializeToString(xmlDoc);
                    return xmlString;
                } catch (err) {
                    return null;
                }
            }

            // Convert a string to XML Node Structure
            // Returns null on failure
            this.stringToXML = function (xmlString) {
                try {
                    var xmlDoc = null;

                    if (window.DOMParser) {

                        var parser = new DOMParser();
                        xmlDoc = parser.parseFromString(xmlString, "text/xml");

                        return xmlDoc;
                    } else {
                        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                        xmlDoc.async = false;
                        xmlDoc.loadXML(xmlString);

                        return xmlDoc;
                    }
                } catch (e) {
                    return null;
                }
            }

            return this;
        }).call({});
        return xmlToJSON;
    }


}


/* tslint:disable */
// polyfill for Object.assign (not part of TS yet)
// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
if (!Object.assign) {
    Object.defineProperty(Object, "assign", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (target) {
            "use strict";
            if (target === undefined || target === null) {
                throw new TypeError("Cannot convert first argument to object");
            }

            var to = Object(target);
            for (var i = 1; i < arguments.length; i++) {
                var nextSource = arguments[i];
                if (nextSource === undefined || nextSource === null) {
                    continue;
                }
                nextSource = Object(nextSource);

                var keysArray = Object.keys(nextSource);
                for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                    var nextKey = keysArray[nextIndex];
                    var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (desc !== undefined && desc.enumerable) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
            return to;
        }
    });
}