import { sys } from "cc";
import { GamePropBase, PropType } from "./GamePropBase";

/**限制 时间 跳跃 */
export class LimitTimeJump extends GamePropBase {

    private Oldthis:LimitTimeJump;

    constructor(timestamp: number) {
        super();
        this.endtime = timestamp;
        this.propType = PropType.duration;
        this.seconds =Math.round(__GameTimeSys.GetTimeDiffNow(this.endtime));
        this.Oldthis=this;
    }

    Use(): void {
        super.Use();
        this.AddEffect();
    }

    public AddEffect() {

    }

    
    public RemoveEffect() {

    }

    public startCountDown(): void {
        __GameTimeSys.schedule(this.countdown.bind(this), 1000,this);
        __GamePropModule.send(__GamePropModule.GamePropModule_UES_JumpTimeCountDown);
    }

    public delCountDown(): void {
        __GameTimeSys.unschedule(this.countdown.bind(this),this);
       
    }
    private countdown(): void {
        this.seconds =Math.round(__GameTimeSys.GetTimeDiffNow(this.endtime));
        if (this.seconds < 0) {
            this.UseEnd();
        }
        console.log("倒计时："+this.seconds);
        __GamePropModule.send(__GamePropModule.GamePropModule_UES_JumpTimeCountDown);
    }
    UseEnd(): void {
        super.UseEnd();
        this.endtime = __GameTimeSys.Now;
        this.delCountDown();
        this.RemoveEffect();
        __GamePropModule.DelOneProp(this);
    }
}