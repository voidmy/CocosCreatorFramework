import { GamePropBase, PropType } from "./GamePropBase";

/**限次跳跃 */
export class LimitFreqJumpProp extends GamePropBase {

    constructor(times: number) {
        super();
        this.propType = PropType.Step_num;
        this.useTimes = times;
        this.addScore = 20;
    }

    Use(): void {
        super.Use();
        __GamePropModule.send(__GamePropModule.GamePropModule_UES_JumpTreq);
    }

    useOne(): void {
        super.useOne();
        __GamePropModule.send(__GamePropModule.GamePropModule_UES_JumpTreq);
        if( this.useTimes==0){
            this.UseEnd();
        }
    }

    /**添加特效 */
    AddEffect():void{

    }

    InitUIFreshUI():void{
        __GamePropModule.send(__GamePropModule.GamePropModule_UES_JumpTreq);
    }

    UseEnd(): void {
        super.UseEnd();
        __GamePropModule.DelOneProp(this);
    }
}