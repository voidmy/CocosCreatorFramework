import { NodeEventType } from "cc";
import { WindowType, Window_C } from "./WindowMgr";

export default class loginPopWindow extends Window_C{

    initialization():void{
        console.log("===initialization initialization");
        this.type= WindowType.FullScreen;
        //this.isApplyAni=false;
        //this.immediatedestroy=true;
    }

    public onOpened():void{
        this.windowNode.getChildByPath("Sprite/Sprite").on(NodeEventType.TOUCH_START,this.hide.bind(this));
        this.windowNode.getChildByPath("Sprite/Sprite-001").on(NodeEventType.TOUCH_START,()=>{

             
            __TestModule.send(__TestModule.MESSAGE_ADD_SCORE);
        });
    }
    
    public  onShown():void{
        
        console.log("===loginPopWindow  OnShow");
    }

    __TestModule(e:string){
        switch(e)
        {
            case __TestModule.MESSAGE_ADD_SCORE:
                console.log( "loginPopWindow "+__TestModule.MESSAGE_ADD_SCORE );
                break;
        }
    }

}