import { NodeEventType, Node, Label, tween, easing } from "cc";
import { WindowType, Window_C } from "./WindowMgr";
import loginPopWindow from "./loginPopWindow";
import startWindow from "./startWindow";
import { PrecisionJump } from "../../Game/GameProp/PrecisionJump";
import ShowMsgWindow, { MsgColorType } from "./ShowMsgWindow";
import { LimitFreqJumpProp } from "../../Game/GameProp/LimitFreqJumpProp";
import { LimitTimeJump } from "../../Game/GameProp/LimitTimeJump";
import GamePropModule from "../Modules/GamePropModule";

export default class HUD_main extends Window_C {

    private m_pauseBtn: Node;
    private m_playBtn: Node;
    private m_blockingNode: Node;
    private m_scoreLab: Label;
    private m_countDown: Label;

    initialization(): void {
        this.type = WindowType.FullScreen;
        this.isApplyAni = false;
    }

    public onOpened(): void {
        this.m_pauseBtn = this.windowNode.getChildByPath("ButtonPanel/pauseBtn") as Node;
        this.m_playBtn = this.windowNode.getChildByPath("ButtonPanel/playBtn") as Node;
        this.m_blockingNode = this.windowNode.getChildByPath("ClickNode") as Node;
        this.m_scoreLab = this.windowNode.getChildByPath("Top/score").getComponent(Label);
        this.m_countDown = this.windowNode.getChildByPath("Top/countDown").getComponent(Label);

        this.windowNode.getChildByPath("ButtonPanel/backBtn").on(NodeEventType.TOUCH_START, this.backToStartUI, this);
        this.m_pauseBtn.on(NodeEventType.TOUCH_START, this.onclickPause, this);
        this.m_playBtn.on(NodeEventType.TOUCH_START, this.onclickplay, this);

        this.m_blockingNode.on(NodeEventType.TOUCH_START, (event) => {
            __HUDMainModule.send(__HUDMainModule.HUDMain_MOUSE_DOWN);
        });

        this.m_blockingNode.on(NodeEventType.TOUCH_END, () => {
            __HUDMainModule.send(__HUDMainModule.HUDMain_MOUSE_UP);
        });
        this.m_blockingNode.on(NodeEventType.TOUCH_CANCEL, () => {
            __HUDMainModule.send(__HUDMainModule.HUDMain_MOUSE_UP);
        });

        this.windowNode.getChildByPath("Bottom/precisBtn").on(NodeEventType.TOUCH_START, this.onClickPrecisBtn, this);
        this.windowNode.getChildByPath("Bottom/limitFreqJumpBtn").on(NodeEventType.TOUCH_START, this.onClicklimitFreqJumpBtn, this);
        this.windowNode.getChildByPath("Bottom/limitTimeJumpBtn").on(NodeEventType.TOUCH_START, this.onClickTimeJumpBtn, this);
        this.windowNode.getChildByPath("Bottom/reviveBtn").on(NodeEventType.TOUCH_START, this.onClickreviveBtn, this);
    }

    public onBindData(): void {
        this.m_pauseBtn.active = false;
        this.m_playBtn.active = true;
        setTimeout(() => { this.m_blockingNode.active = true; }, 500);
        this.refreshUI();
        this.refreshCoundTimes();
        this.refreshLimitTimeUI();
    }

    public onShown(): void {

        //console.log("===loginWindow  OnShow");
    }

    private refreshUI(isTwee: boolean = false): void {
        //this.m_scoreLab.string=__HUDMainModule.GetScore()+"分";
        let syffix: string = "分";
        let endValue = __HUDMainModule.GetScore();
        let startValue = Number(this.m_scoreLab.string.replace(syffix, ""));
        //console.log("startValue:"+startValue);
        //console.log("endValue:"+endValue);
        if (startValue == endValue) return;
        if (isTwee) {
            let obj = { value: startValue }
            tween(obj)
                .to(0.4, { value: endValue }, {
                    onUpdate: (obj2, current) => {
                        // 把当前值四舍五入并转成字符串
                        // console.log("current:"+obj.value);
                        this.m_scoreLab.string = Math.round(Number(obj.value)) + syffix;
                        return current;
                    }
                })

                .start();
        } else {
            this.m_scoreLab.string = endValue + syffix;
        }

    }

    protected onHide(): void {
        this.m_blockingNode.active = false;
    }

    private backToStartUI(): void {
        __GameManger.BackStartWindow();
    }

    private onclickPause(): void {
        this.m_pauseBtn.active = false;
        this.m_playBtn.active = true;
        __HUDMainModule.send(__HUDMainModule.HUDMain_START_Game);
    }

    private onclickplay(): void {
        this.m_pauseBtn.active = true;
        this.m_playBtn.active = false;
        __HUDMainModule.send(__HUDMainModule.HUDMain_START_Game);
    }

    private onClickPrecisBtn(event): void {
        event.propagationStopped = true;

        let precis = new PrecisionJump();
        __GamePropModule.AddOneProp(precis);
        //precis.Use();
        __GamePropModule.send(__GamePropModule.GamePropModule_UES_PrecisionJump);
        console.log("使用精准跳跃 道具");

        Window_C.Show(ShowMsgWindow, "使用精准跳跃 道具", MsgColorType.Green);
    }

    private onClicklimitFreqJumpBtn(event): void {
        event.propagationStopped = true;
        if(__GamePropModule.HasCountDownOrJumpStep()){
            Window_C.Show(ShowMsgWindow, "等待 道具使用完成 才能使用", MsgColorType.Green);
            return;
        }
        let prop = new LimitFreqJumpProp(5);
        __GamePropModule.AddOneProp(prop);
        prop.InitUIFreshUI();
        Window_C.Show(ShowMsgWindow, "使用限次 道具", MsgColorType.Green);
    }

    private onClickTimeJumpBtn(event): void {
        event.propagationStopped = true;
        if(__GamePropModule.HasCountDownOrJumpStep()){
            Window_C.Show(ShowMsgWindow, "等待 道具使用完成 才能使用", MsgColorType.Yellow);
            return;
        }
        let prop = new LimitTimeJump(__GameTimeSys.AddTimesSecond(__GameTimeSys.Now, 10));
        __GamePropModule.AddOneProp(prop);
        prop.Use();
        prop.startCountDown();
        Window_C.Show(ShowMsgWindow, "使用限时 道具", MsgColorType.Green);
    }

    isTag: boolean = true;
    private onClickreviveBtn(event): void {
        event.propagationStopped = true;
        if (this.isTag) {
          __GameTimeSys.stopAllInterval();
        }else{
            __GameTimeSys.resumeAllInterval();
        }
        this.isTag=!this.isTag;
    }

    private refreshCoundTimes(): void {
        let times = __GamePropModule.GetJumpTimes();
        let suffix: string = "步"
        if (times < 1) {
            this.m_countDown.string = "";
        } else {
            this.m_countDown.string = times + suffix;
        }
    }


    private refreshLimitTimeUI(): void {
        let times = __GamePropModule.GetCountTime();
        let suffix: string = "秒"
        if (times < 1) {
            this.m_countDown.string = "";
        } else {
            this.m_countDown.string = times + suffix;
        }
    }

    __HUDMainModule(e): void {
        switch (e) {
            case __HUDMainModule.HUDMain_REFRESH_UI:
                this.refreshUI(true);
                break;
        }
    }

    __GamePropModule(e): void {
        switch (e) {
            case __GamePropModule.GamePropModule_UES_JumpTreq:
                this.refreshCoundTimes();
                break;
            case __GamePropModule.GamePropModule_UES_JumpTimeCountDown:
                this.refreshLimitTimeUI();
                break;
        }
    }
}