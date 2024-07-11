import { NodeEventType } from "cc";
import { WindowType, Window_C } from "./WindowMgr";
import loginPopWindow from "./loginPopWindow";
import HUD_main from "./HUD_main";
import startWindow from "./startWindow";

export default class gamefailWindow extends Window_C {

    initialization(): void {
        //console.log("===initialization initialization");
        this.type = WindowType.FullScreen;
    }

    public onOpened(): void {
        this.windowNode.getChildByPath("backBtn").on(NodeEventType.TOUCH_START, () => {
            __GameManger.BackStartWindow();
        });
    }


    public onShown(): void {

        //console.log("===loginWindow  OnShow");
    }

     public onHide(): void {
       
    }
}