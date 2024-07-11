import { _decorator, Component, director, Label, Node, sys } from 'cc';
declare global {
    const __GameTimeSys: GameTimeSys
}
export class GameTimeSys {

    private m_GameTimeSysNode: Node;

    private m_UniSecond: number = 1000;

    private _Interdict: Map<string, InterCc> = new Map(); // 创建定时器字典

    public SetTimeNode(node: Node) {
        this.m_GameTimeSysNode = node;
        //let com=new Label();
        node.addComponent(Label).string = "";
    }

    /**
     * 不能 使用schedule 定时器
     */
    get TimeNode(): Component {
        return this.m_GameTimeSysNode.getComponent(Component);
    }

    /**
     * 开启一个定时器  记住bind this
     * @interval 时间间隔 毫秒
    */
    public schedule(callback_fn: Function, interval: number, target: any): number {
        let key = target.constructor.name + callback_fn.name;
        if (this._Interdict.has(key)){
            console.warn("has same key Interval")
            return;
        }
        let val = new InterCc();
        val.callback_fn = callback_fn;
        val.interval = interval;
        val.target = target;

        let timeID = setInterval(callback_fn, interval);
        val.interID = timeID;
        this._Interdict.set(key, val);
        return timeID;
    }

    public unschedule(callback_fn: Function, target: any): void {
        let key = target.constructor.name + callback_fn.name;
        if (this._Interdict.has(key)) {
            // 如果存在key，就删除它
            let val = this._Interdict.get(key);
            clearInterval(val.interID);
            this._Interdict.delete(key);
        }
    }

    public stopAllInterval() {
        for (let [key, timer] of this._Interdict.entries()) {
            clearInterval(timer.interID);
        }
    }

    public resumeAllInterval() {
        this.stopAllInterval();
        for (let [key, timer] of this._Interdict.entries()) {
            let timeID = setInterval(timer.callback_fn, timer.interval);
            timer.interID=timeID;
        }
    }

    get Now(): number {
        return sys.now();
    }

    /**毫秒 时间戳 加上几秒 */
    public AddTimesSecond(timestamp: number, second: number): number {
        return timestamp + second * this.m_UniSecond;
    }

    /**两个 时间戳 相差多少秒
     * timestamp 被减
     */
    public diffSeconds(timestamp: number, timestamp2: number): number {
        return (timestamp2 - timestamp) / this.m_UniSecond;
    }

    /**
     * 得到当前时间戳 与服务器时间相差多少秒
     * @param timestamp 
     * @returns 
     */
    public GetTimeDiffNow(timestamp: number): number {
        return this.diffSeconds(this.Now, timestamp);
    }

}

export class InterCc {
    public callback_fn: Function;
    public target: any;
    public interval: number;
    public interID: number;
}