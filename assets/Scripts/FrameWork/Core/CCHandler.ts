export class CCHandler {
    once: boolean;
     _id: number;
    static _gid: any;
    caller: any;
    method: any;
    args: any;
    static _pool: any= [];

    constructor(caller = null, method = null, args = null, once = false) {
        this.once = false;
        this._id = 0;
        this.setTo(caller, method, args, once);
    }
    
    setTo(caller, method, args, once = false) {
        this._id = CCHandler._gid++;
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
            CCHandler._pool.push(this.clear());
        }
    }
    static create(caller, method, args = null, once = true) {
        if (CCHandler._pool.length)
            return CCHandler._pool.pop().setTo(caller, method, args, once);
        return new CCHandler(caller, method, args, once);
    }
}
