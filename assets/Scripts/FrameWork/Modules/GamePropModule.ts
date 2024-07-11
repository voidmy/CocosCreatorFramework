import { GamePropBase, PropState, PropType } from "../../Game/GameProp/GamePropBase";
import Module from "../ModuleManager";

export default class GamePropModule extends Module {

    public readonly GamePropModule_UES_PrecisionJump = "GamePropModuleUESPrecisionJump";

    public readonly GamePropModule_UES_JumpTreq = "GamePropModuleUESJumpFreq";

    public readonly GamePropModule_UES_JumpTimeCountDown = "GamePropModuleUESJumpTimeCountDown";

    public gamePropUses: GamePropBase[] = [];

    public DelOneProp(prop: GamePropBase): boolean {

        let index = this.gamePropUses.findIndex((x) => { return prop === x });
        if (index != -1) {
            this.gamePropUses.splice(index, 1);
            return true;
        }

        return false;
    }

    public AddOneProp(prop: GamePropBase):void{
        this.gamePropUses.push(prop);
    }

    public GetJumpTimes():number{
        let times=0;
        let index = this.gamePropUses.findIndex((x) => { return x.propType==PropType.Step_num });
        if (index != -1) {
            times= this.gamePropUses[index].useTimes;  
        }
        return times;
    }

    public GetCountTime():number{
        let seconds=0;
        let index = this.gamePropUses.findIndex((x) => { return x.propType==PropType.duration });
        if (index != -1) {
            seconds= this.gamePropUses[index].seconds;  
        }
        return seconds;
    }

    public HasCountDownOrJumpStep():boolean{
        let index = this.gamePropUses.findIndex((x) => { return x.propType==PropType.duration });
        if (index != -1) {
            return true;
        }
        index = this.gamePropUses.findIndex((x) => { return x.propType==PropType.Step_num });
        if (index != -1) {
            return true;
        }
        return false;
    }

    public ClearAllProp(){
        for(let i=0;i< this.gamePropUses.length;i++){
            this.gamePropUses[i].UseEnd();
        }
        this.gamePropUses=[];
    }
}
