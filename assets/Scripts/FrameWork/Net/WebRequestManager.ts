

export default class WebRequestManager {
    static responseId: number = 0;
    static Put(url: string, data: any, callBack?:CCHandler) {
        if (__STANDALONE) {
            var res = new BaseResponse();
            res.success = true;
            callBack.runWith(res);
            return;
        }

        WebRequestHolder.Create(url, data, "put", callBack);
    }

    static Post(url: string, data: any, callBack?:CCHandler) {
        if (__STANDALONE) {
            var res = new BaseResponse();
            res.success = true;
            callBack.runWith(res);
            return;
        }

        WebRequestHolder.Create(url, data, "post", callBack);
    }

    static Get(url: string, data: {}, callBack?:CCHandler) {
        if (__STANDALONE) {
            var res = new BaseResponse();
            res.success = true;
            callBack.runWith(res);
            return;
        }

        var params = this.formatParams(data);
        if (!_isNullOrEmpty(params))
            url += `?${params}`;
        WebRequestHolder.Create(url, undefined, "get", callBack);
    }

    static Delete(url: string, callBack?: CCHandler) {
        WebRequestHolder.Create(url, undefined, "delete", callBack);
    }

    static JsonP(options: IJsonPRequest) {
        if (_isNullOrEmpty(options.url) || !options.callbackHandler)
            throw `参数不合法`;

        if (__STANDALONE) {
            var res = new BaseResponse();
            res.success = true;
            options.callbackHandler?.runWith(res);
            return;
        }

        var callbackName = ('jsonp_' + (++this.responseId));
        var oHead = document.getElementsByTagName('head')[0];
        if (!options.data)
            options.data = {};
        if (options.callback)
            options.data[options.callback] = callbackName;
        else
            options.data["callback"] = callbackName;
        var params = this.formatParams(options.data);
        var oS = document.createElement('script');
        oHead.appendChild(oS);

        //创建jsonp回调函数
        window[callbackName] = function (json) {
            oHead.removeChild(oS);
            clearTimeout(oS["timer"]);
            window[callbackName] = null;
            console.log(`${options.url} response`);
            console.log(json);
            options.callbackHandler && options.callbackHandler.runWith(json);
        };

        //发送请求
        oS.src = options.url + '?' + params;

        //超时处理
        oS["timer"] = setTimeout(function () {
            window[callbackName] = null;
            oHead.removeChild(oS);
            var res = new BaseResponse();
            res.success = false;
            res.msg = "请求超时！";
            options.callbackHandler && options.callbackHandler.runWith(res);
        }, options.time ?? 10000);
    }

    static formatParams(data) {
        var arr = [];
        for (var name in data) {
            arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
        }
        return arr.join('&');
    }
}

export interface IJsonPRequest {
    url: string;
    data: {};
    callback?: string;
    callbackHandler: CCHandler;
    time?: number;
}

// Common response data
export class BaseResponse {
    // 0 = OK, others = error
    public success: boolean = false;
    // Message may be empty
    public msg: string;
}

interface IDestroy{
    destroyed:boolean;
    destroy():void;
}

class WebRequestHolder implements IDestroy {
    private static m_pool: WebRequestHolder[] = []
    private static Get(): WebRequestHolder {
        if (this.m_pool.length < 1) return new WebRequestHolder();
        return this.m_pool.pop();
    }
    private static Back(holder: WebRequestHolder) {
        if (!holder) return;
        this.m_pool.push(holder);
    }
    private static BuildFormData(data: object): FormData {
        var form = new FormData();
        for (const key in data) {
            if (!data.hasOwnProperty(key)) continue;
            form.append(key, data[key])
        }
        return form;
    }

    static Create(url: string, data?: any, method?: string, callBack?: CCHandler) {

        let holder = WebRequestHolder.Get();
        holder.destroyed = false;
        holder.m_onComplete = callBack;
        holder.m_xhr.send(url, data, method, "json");

        console.log(`Request ${method} ${url}`);
        if (data) console.log(data);
    }

    m_onComplete: CCHandler;
    m_xhr: HttpRequest;

    constructor() {
        this.m_xhr = new HttpRequest();
        this.m_xhr.on(Pitaya.Event.COMPLETE, this, this.OnComplete);
        this.m_xhr.on(Pitaya.Event.ERROR, this, this.OnError);
    }

    destroyed: boolean = false;
    destroy(): void {
        if (this.destroyed)
            return;
        this.destroyed = true;
        WebRequestHolder.Back(this)
    }

    private OnError() {
        this.m_onComplete?.run();
        this.destroy();
    }

    private OnComplete() {
        console.log(`Response: `, this.m_xhr.data);

        var response = this.m_xhr.data as BaseResponse;
        if (!_isString(response.msg)) {
            response.msg = JSON.stringify(response.msg);
        }
        this.m_onComplete?.runWith(response);
        this.destroy();
    };
}

