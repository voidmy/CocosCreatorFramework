import { CCHandler } from "./CCHandler";

export class CCEventHandler extends CCHandler {

   public constructor(caller, method, args, once) {
        super(caller, method, args, once);
    }
    recover() {
        if (this._id > 0) {
            this._id = 0;
            CCEventHandler._pool.push(this.clear());
        }
    }
    static create(caller, method, args = null, once = true) {
        if (CCEventHandler._pool.length)
            return CCEventHandler._pool.pop().setTo(caller, method, args, once);
        return new CCEventHandler(caller, method, args, once);
    }
}
