import { CCEvent } from "./CCEvent";
import { EventDispatcher } from "./EventDispatcher";

export class HttpRequest extends EventDispatcher {
    static _urlEncode: (uri: string) => string;
    private _http: XMLHttpRequest;
    private _responseType: string;
    private _data: any;
    private _url: any;
    constructor() {
        super();
        //super(...arguments);
        this._http = new XMLHttpRequest();
    }
    send(url, data = null, method = "get", responseType = "text", headers = null) {
        this._responseType = responseType;
        this._data = null;
        /*if (Browser.onVVMiniGame || Browser.onQGMiniGame || Browser.onQQMiniGame || Browser.onAlipayMiniGame || Browser.onBLMiniGame || Browser.onHWMiniGame || Browser.onTTMiniGame) {
            url = HttpRequest._urlEncode(url);
        }*/
        this._url = url;
        var _this = this;
        var http = this._http;
        //url = URL.getAdptedFilePath(url);
        http.open(method, url, true);
        let isJson = false;
        if (headers) {
            for (var i = 0; i < headers.length; i++) {
                http.setRequestHeader(headers[i++], headers[i]);
            }
        }
        /*else if (!(window.conch)) {
            if (!data || typeof (data) == 'string')
                http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            else {
                http.setRequestHeader("Content-Type", "application/json");
                isJson = true;
            }
        }*/
        var restype = responseType !== "arraybuffer" ? "text" : "arraybuffer";
        http.responseType = 'text';
        // http.responseType = restype;
        if (http["dataType"]) {
           // http["dataType"] = restype;
           http["dataType"] = 'text';
        }
        http.onerror = function (e) {
            _this._onError(e);
        };
        http.onabort = function (e) {
            _this._onAbort(e);
        };
        http.onprogress = function (e) {
            _this._onProgress(e);
        };
        http.onload = function (e) {
            _this._onLoad(e);
        };
        /*if (Browser.onBLMiniGame && Browser.onAndroid && !data)
            data = {};*/
        isJson=true;
        console.log("data========");
        console.log(data);
        http.send(isJson ? JSON.stringify(data) : data);
    }
    _onProgress(e) {
        if (e && e.lengthComputable)
            this.event(CCEvent.PROGRESS, e.loaded / e.total);
    }
    _onAbort(e) {
        this.error("Request was aborted by user");
    }
    _onError(e) {
        this.error("Request failed Status:" + this._http.status + " text:" + this._http.statusText);
    }
    _onLoad(e) {
        var http = this._http;
        var status = http.status !== undefined ? http.status : 200;
        if (status === 200 || status === 204 || status === 0) {
            this.complete();
        }
        else {
            this.error("[" + http.status + "]" + http.statusText + ":" + http.responseURL);
        }
    }
    error(message) {
        this.clear();
        console.warn(this.url, message);
        this.event(CCEvent.ERROR, message);
    }
    complete() {
        this.clear();
        var flag = true;
        try {
            if (this._responseType === "json") {
                this._data = JSON.parse(this._http.responseText);
            }
            else if (this._responseType === "xml") {
               /// this._data = Utils.parseXMLFromString(this._http.responseText);
               console.error("no parseXMLFromString xml ");
            }
            else {
                this._data = this._http.response || this._http.responseText;
            }
        }
        catch (e) {
            flag = false;
            this.error(e.message);
        }
        flag && this.event(CCEvent.COMPLETE, this._data instanceof Array ? [this._data] : this._data);
    }
    clear() {
        var http = this._http;
        http.onerror = http.onabort = http.onprogress = http.onload = null;
    }
    get url() {
        return this._url;
    }
    get data() {
        return this._data;
    }
    get http() {
        return this._http;
    }
}
HttpRequest._urlEncode = encodeURI;
