import {StoreModel} from "../models/StoreModel";
import List = Immutable.List;
export class AppModel extends StoreModel {

    constructor(data:any = {}) {
        super(data);
    }

    public getIcon(item:AppModel) {
        var id = String(item.getAppId());
        switch (id) {
            case '10005': // Embeded Resource
                return 'fa-cubes';
            case '10010': // Scene
                return 'fa-edit';
            case '10020': // External Resource
                return 'fa-paper-plane-o';
            case '10030': // Label
                return 'fa-terminal';
            case '10040': // Html
                return 'fa-html5';
            case '10050': // Rss Text
                return 'fa-rss';
            case '10060': // Custom Rss
                return 'fa-th-list';
            case '10070': // Media Rss/Podcast
                return 'fa-video-camera';
            case '10080': // Weather
                return 'fa-sun-o';
            case '10090': // Stock
                return 'fa-bar-chart';
            case '10100': // Catalog
                return 'fa-database';
            case '10110': // Capture/Camera
                return 'fa-camera';
            case '10120': // Clock
                return 'fa-clock-o';
            case '10122': // 	Countdown
                return 'fa-dashboard';
            case '10130': // Grid/Chart
                return 'fa-area-chart';
            case '10140': // Ext Application
                return 'fa-puzzle-piece';
            case '10145': // 	Webkit
                return 'fa-globe';
            case '10150': // AdNet
                return 'fa-tag';
            case '10160': // QR Code
                return 'fa-qrcode';
            case '10180': // CollectionViewer
                return 'fa-align-justify ';
            case '10185': // 	Location based
                return 'fa-map-pin';
            case '10190': // XML Player
                return 'fa-code';
            case '10195': // 	JSON Player
                return 'fa-plug';
            case '10210': // Twitter
                return 'fa-twitter';
            case '10220': // YouTube
                return 'fa-youtube';
            case '10300': // Form
                return 'fa-check-square-o';
            case '10400': // Message
                return 'fa-comment';
            case '10500': // Label Queue
                return 'fa-align-center';
            case '11000': // Browser
                return 'fa-firefox';
            case '12000': // Digg
                return 'fa-digg';
            case '12010': // World weather
                return 'fa-cloud';
            case '12020': // Facebook
                return 'fa-facebook-official ';
            case '12030': // Google calendar
                return 'fa-calendar';
            case '12032': // Google Sheets
                return 'fa-table';
            case '12040': // Google plus
                return 'fa-google-plus-square';
            case '12050': // Picasa
                return 'fa-eye';
            case '12060': // Instagram
                return 'fa-instagram';
            case '12070': // Google drive
                return 'fa-google-plus';
            case '12080': // 500px
                return 'fa-500px';
            case '12090': // Pinterest
                return 'fa-pinterest';
            case '12100': // FasterQ
                return 'fa-male';
            case '12200': // Tumblr
                return 'fa-tumblr-square';
            case '12210': // Dropbox
                return 'fa-dropbox';
            case '12220': // Flickr
                return 'fa-flickr';
            case '12230': // Twitter
                return 'fa-twitter';
            case '12240': // Yelp
                return 'fa-yelp';
            case '12250': // Etsy
                return 'fa-comments';
            case '12260': // Mashape
                return 'fa-clone';
            default: {
                return 'fa-circle';
            }
        }
    }

    public getAppId() {
        return this.getKey('appId');
    }

    public getName() {
        return this.getKey('appName');
    }

    public getInstalled() {
        return this.getKey('installed');
    }

}