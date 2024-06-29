export class CCEvent {
    type: any;
    currentTarget: any;
    target: any;
    _stoped: boolean;
    nativeEvent: any;
    static ERROR= "error";
    static COMPLETE="complete";
    static PROGRESS = "progress";
    static EMPTY = new CCEvent();
    setTo(type, currentTarget, target) {
        this.type = type;
        this.currentTarget = currentTarget;
        this.target = target;
        return this;
    }
    stopPropagation() {
        this._stoped = true;
    }

}