import { NodeEventType } from "cc";
import { Window_C } from "./WindowMgr";

export default class loginWindow extends Window_C{

    public onOpened():void{
        this.windowNode.getChildByName("Sprite").on(NodeEventType.TOUCH_START,this.hide.bind(this));
    }
    
    public  OnShow():void{
        
        console.log("===loginWindow  OnShow");
    }
}