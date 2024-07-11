import { GamePropBase, PropType } from "./GamePropBase";


export class PrecisionJump extends GamePropBase{

    constructor(){
        super();
        this.propType=PropType.One_time;
    }
    
    Use(): void {
        super.Use();
        this.useTimes=1;
        __GameCoreModule.centrJump=true;
    }


    UseEnd(): void {
        super.UseEnd();
        __GameCoreModule.centrJump=false;
        __GamePropModule.DelOneProp(this);
    }
}