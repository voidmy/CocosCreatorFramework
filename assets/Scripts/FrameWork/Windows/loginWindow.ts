import { NodeEventType } from "cc";
import { WindowType, Window_C } from "./WindowMgr";
import loginPopWindow from "./loginPopWindow";

export default class loginWindow extends Window_C {

    initialization(): void {
        console.log("===initialization initialization");
        this.type = WindowType.FullScreen;
        //this.isApplyAni=false;
        //this.immediatedestroy=true;
    }

    public onOpened(): void {
        this.windowNode.getChildByPath("Sprite/btnHide").on(NodeEventType.TOUCH_START, this.hide.bind(this));
        this.windowNode.getChildByPath("Sprite/btnShow").on(NodeEventType.TOUCH_START, () => {
            Window_C.Show<loginPopWindow>(loginPopWindow);

        });
    }

    __TestModule(e:string){
        switch(e)
        {
            case __TestModule.MESSAGE_ADD_SCORE:
                this.hide()
                console.log( "loginWindow "+__TestModule.MESSAGE_ADD_SCORE );
                break;
        }
    }

    public onShown(): void {

        console.log("===loginWindow  OnShow");
    }
}