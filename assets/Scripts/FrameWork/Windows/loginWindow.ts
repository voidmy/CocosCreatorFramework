import { NodeEventType } from "cc";
import { WindowType, Window_C } from "./WindowMgr";

export default class loginWindow extends Window_C{

    initialization():void{
        console.log("===initialization initialization");
        this.type= WindowType.FullScreen;
        //this.isApplyAni=false;
        //this.immediatedestroy=true;
    }

    public onOpened():void{
        this.windowNode.getChildByName("Sprite").on(NodeEventType.TOUCH_START,this.hide.bind(this));
    }
    
    public  onShown():void{
        
        console.log("===loginWindow  OnShow");
    }
}