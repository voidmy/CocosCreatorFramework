function sssMa(){
    console.log("===sssMa");

}
// 具体的实现
export class MessageCenter {
    static validSender(sender) {
        return sender && sender.listeners;
    }
    static register(sender, receiver, handler) {
        let ls = this.validSender(sender);
        if (!ls)
            return;
        let h = typeof handler === 'string' ? receiver[handler] : handler;
        if (!h || typeof h !== 'function') {
            console.warn("MessageCenter: receiver %s has invalid handler %s", receiver, handler);
            return;
        }
        for (let i = 0; i < ls.length; ++i) {
            let l = ls[i];
            if (l && l.receiver === receiver && l.handler === h) {
                delete ls[i];
                ls.push(l);
                return;
            }
        }
        sender.listeners.push({ receiver: receiver, handler: h });
        let idx = this.m_senders.indexOf(sender);
        if (idx < 0)
            this.m_senders.push(sender);
    }
    static send(sender, message, ...args) {
        let ls = this.validSender(sender);
        if (!ls)
            return;
        sender.sending++;
        for (let i = 0; i < ls.length;) {
            let l = ls[i];
            if (!l)
                sender.sending > 1 ? ++i : ls.splice(i, 1);
            else {
                l.handler.call(l.receiver, message, sender, ...args);
                ++i;
            }
        }
        sender.sending--;
    }
    static remove(receiver) {
        for (const sender of this.m_senders) {
            let ls = this.validSender(sender);
            if (!ls)
                continue;
            for (let i = 0; i < ls.length; ++i) {
                let l = ls[i];
                if (l && l.receiver === receiver)
                    delete ls[i];
            }
        }
    }
}
MessageCenter.m_senders = [];
window.MessageCenter = MessageCenter;

export class CCHandler {
    constructor(caller = null, method = null, args = null, once = false) {
        this.once = false;
        this._id = 0;
        this.setTo(caller, method, args, once);
    }
    setTo(caller, method, args, once = false) {
        this._id = Handler._gid++;
        this.caller = caller;
        this.method = method;
        this.args = args;
        this.once = once;
        return this;
    }
    run() {
        if (this.method == null)
            return null;
        var id = this._id;
        var result = this.method.apply(this.caller, this.args);
        this._id === id && this.once && this.recover();
        return result;
    }
    runWith(data) {
        if (this.method == null)
            return null;
        var id = this._id;
        if (data == null)
            var result = this.method.apply(this.caller, this.args);
        else if (!this.args && !data.unshift)
            result = this.method.call(this.caller, data);
        else if (this.args)
            result = this.method.apply(this.caller, this.args.concat(data));
        else
            result = this.method.apply(this.caller, data);
        this._id === id && this.once && this.recover();
        return result;
    }
    clear() {
        this.caller = null;
        this.method = null;
        this.args = null;
        return this;
    }
    recover() {
        if (this._id > 0) {
            this._id = 0;
            Handler._pool.push(this.clear());
        }
    }
    static create(caller, method, args = null, once = true) {
        if (Handler._pool.length)
            return Handler._pool.pop().setTo(caller, method, args, once);
        return new Handler(caller, method, args, once);
    }
}
 CCHandler._pool = [];
CCHandler._gid = 1;


class HttpRequest extends EventDispatcher {
    constructor() {
        super(...arguments);
        this._http = new XMLHttpRequest();
    }
    send(url, data = null, method = "get", responseType = "text", headers = null) {
        this._responseType = responseType;
        this._data = null;
        if (Browser.onVVMiniGame || Browser.onQGMiniGame || Browser.onQQMiniGame || Browser.onAlipayMiniGame || Browser.onBLMiniGame || Browser.onHWMiniGame || Browser.onTTMiniGame) {
            url = HttpRequest._urlEncode(url);
        }
        this._url = url;
        var _this = this;
        var http = this._http;
        url = URL.getAdptedFilePath(url);
        http.open(method, url, true);
        let isJson = false;
        if (headers) {
            for (var i = 0; i < headers.length; i++) {
                http.setRequestHeader(headers[i++], headers[i]);
            }
        }
        else if (!(window.conch)) {
            if (!data || typeof (data) == 'string')
                http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            else {
                http.setRequestHeader("Content-Type", "application/json");
                isJson = true;
            }
        }
        let restype = responseType !== "arraybuffer" ? "text" : "arraybuffer";
        http.responseType = restype;
        if (http.dataType) {
            http.dataType = restype;
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
        if (Browser.onBLMiniGame && Browser.onAndroid && !data)
            data = {};
        http.send(isJson ? JSON.stringify(data) : data);
    }
    _onProgress(e) {
        if (e && e.lengthComputable)
            this.event(Event.PROGRESS, e.loaded / e.total);
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
        this.event(Event.ERROR, message);
    }
    complete() {
        this.clear();
        var flag = true;
        try {
            if (this._responseType === "json") {
                this._data = JSON.parse(this._http.responseText);
            }
            else if (this._responseType === "xml") {
                this._data = Utils.parseXMLFromString(this._http.responseText);
            }
            else {
                this._data = this._http.response || this._http.responseText;
            }
        }
        catch (e) {
            flag = false;
            this.error(e.message);
        }
        flag && this.event(Event.COMPLETE, this._data instanceof Array ? [this._data] : this._data);
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

class EventDispatcher {
    hasListener(type) {
        var listener = this._events && this._events[type];
        return !!listener;
    }
    event(type, data = null) {
        if (!this._events || !this._events[type])
            return false;
        var listeners = this._events[type];
        if (listeners.run) {
            if (listeners.once)
                delete this._events[type];
            data != null ? listeners.runWith(data) : listeners.run();
        }
        else {
            for (var i = 0, n = listeners.length; i < n; i++) {
                var listener = listeners[i];
                if (listener) {
                    (data != null) ? listener.runWith(data) : listener.run();
                }
                if (!listener || listener.once) {
                    listeners.splice(i, 1);
                    i--;
                    n--;
                }
            }
            if (listeners.length === 0 && this._events)
                delete this._events[type];
        }
        return true;
    }
    on(type, caller, listener, args = null) {
        return this._createListener(type, caller, listener, args, false);
    }
    once(type, caller, listener, args = null) {
        return this._createListener(type, caller, listener, args, true);
    }
    _createListener(type, caller, listener, args, once, offBefore = true) {
        offBefore && this.off(type, caller, listener, once);
        var handler = EventHandler.create(caller || this, listener, args, once);
        this._events || (this._events = {});
        var events = this._events;
        if (!events[type])
            events[type] = handler;
        else {
            if (!events[type].run)
                events[type].push(handler);
            else
                events[type] = [events[type], handler];
        }
        return this;
    }
    off(type, caller, listener, onceOnly = false) {
        if (!this._events || !this._events[type])
            return this;
        var listeners = this._events[type];
        if (listeners != null) {
            if (listeners.run) {
                if ((!caller || listeners.caller === caller) && (listener == null || listeners.method === listener) && (!onceOnly || listeners.once)) {
                    delete this._events[type];
                    listeners.recover();
                }
            }
            else {
                var count = 0;
                for (var i = 0, n = listeners.length; i < n; i++) {
                    var item = listeners[i];
                    if (!item) {
                        count++;
                        continue;
                    }
                    if (item && (!caller || item.caller === caller) && (listener == null || item.method === listener) && (!onceOnly || item.once)) {
                        count++;
                        listeners[i] = null;
                        item.recover();
                    }
                }
                if (count === n)
                    delete this._events[type];
            }
        }
        return this;
    }
    offAll(type = null) {
        var events = this._events;
        if (!events)
            return this;
        if (type) {
            this._recoverHandlers(events[type]);
            delete events[type];
        }
        else {
            for (var name in events) {
                this._recoverHandlers(events[name]);
            }
            this._events = null;
        }
        return this;
    }
    offAllCaller(caller) {
        if (caller && this._events) {
            for (var name in this._events) {
                this.off(name, caller, null);
            }
        }
        return this;
    }
    _recoverHandlers(arr) {
        if (!arr)
            return;
        if (arr.run) {
            arr.recover();
        }
        else {
            for (var i = arr.length - 1; i > -1; i--) {
                if (arr[i]) {
                    arr[i].recover();
                    arr[i] = null;
                }
            }
        }
    }
    isMouseEvent(type) {
        return EventDispatcher.MOUSE_EVENTS[type] || false;
    }
}

class Event {
    setTo(type, currentTarget, target) {
        this.type = type;
        this.currentTarget = currentTarget;
        this.target = target;
        return this;
    }
    stopPropagation() {
        this._stoped = true;
    }
    get touches() {
        if (!this.nativeEvent)
            return null;
        var arr = this.nativeEvent.touches;
        if (arr) {
            var stage = ILaya.stage;
            for (var i = 0, n = arr.length; i < n; i++) {
                var e = arr[i];
                var point = Point.TEMP;
                point.setTo(e.clientX, e.clientY);
                stage._canvasTransform.invertTransformPoint(point);
                stage.transform.invertTransformPoint(point);
                e.stageX = point.x;
                e.stageY = point.y;
            }
        }
        return arr;
    }
}
Event.EMPTY = new Event();
Event.ERROR = "error";
Event.COMPLETE = "complete";