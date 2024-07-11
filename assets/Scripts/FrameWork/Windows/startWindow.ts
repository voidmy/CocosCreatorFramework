import { NodeEventType, Toggle } from "cc";
import { WindowType, Window_C } from "./WindowMgr";
import loginPopWindow from "./loginPopWindow";
import HUD_main from "./HUD_main";
import WebRequestManager from "../Net/WebRequestManager";
import WebAPI from "../Net/WebAPI";
import { CCHandler } from "../Core/CCHandler";
import { StartGameMsg } from "../Net/WebMsg";
import { WebSendHelp } from "../Net/WebSendHelp";

export default class startWindow extends Window_C {

    initialization(): void {
        //console.log("===initialization initialization");
        this.type = WindowType.FullScreen;
         this.isApplyAni=false;
        //this.immediatedestroy=true;
    }

    public onOpened(): void {
        let preciseToggle=this.windowNode.getChildByPath("ButtonPanel/Toggle");
        preciseToggle.on('toggle', this.precisionJump, this);
        __GameCoreModule.centrJump=preciseToggle.getComponent(Toggle).isChecked;
        this.windowNode.getChildByPath("ButtonPanel/PlayGameBtn").on(NodeEventType.TOUCH_START, () => {
            //Window_C.Show<loginPopWindow>(loginPopWindow);
              console.log("开始游戏");
              __HUDMainModule.ResetScoreData();
              __GamePropModule.ClearAllProp();
              Window_C.Show<HUD_main>(HUD_main);
             WebSendHelp.SendStartGem(9999998,"9999999",CCHandler.create(this,()=>{

                  console.log("WebSendHelp.SendStartGem success")

             }));
              __HUDMainModule.send(__HUDMainModule.HUDMain_START_Game);
              this.hide();
        });
    }

    private precisionJump(toggle: Toggle):void{
             __GameCoreModule.centrJump=toggle.isChecked;
    }

    __TestModule(e:string){
        switch(e)
        {
            case __TestModule.MESSAGE_ADD_SCORE:
                //this.hide()
               // console.log( "loginWindow "+__TestModule.MESSAGE_ADD_SCORE );
                break;
        }
    }

    public onShown(): void {

        //console.log("===loginWindow  OnShow");
    }
}