import { NodeEventType, Node, instantiate, Label, v2, tween, Vec2, Vec3, Color, UIOpacity, Tween } from "cc";
import { WindowType, Window_C } from "./WindowMgr";
import loginPopWindow from "./loginPopWindow";
import { Util } from "../../Game/Utils/Util";

export default class ShowMsgWindow extends Window_C {

    private m_tip: Node;

    private m_tipsPool: Node[] = [];
    private m_showNodes: Node[] = [];

    private m_Red: Color = new Color(255, 0, 0);

    private m_Green: Color = new Color(0, 255, 0);

    private m_yellow: Color = new Color(255, 255, 0);



    initialization(): void {
        //console.log("===initialization initialization");
        this.type = WindowType.Global;
        this.isApplyAni = false;
        //this.immediatedestroy=true;
    }

    public onOpened(): void {
        this.m_tip = this.windowNode.getChildByName("loadTip");
    }

    public onShown(): void {

        //console.log("===loginWindow  OnShow");
        let colortype = this.getArg(1) as MsgColorType;
        let msg = this.GetTips();
        this.windowNode.addChild(msg);
        msg.position = this.m_tip.position;
        msg.active = true;
        let lab = msg.getComponent(Label);
        lab.color =this.GetColor(colortype);
        this.PlayFly(lab);
    }

    public PlayFly(label: Label): void {

        let tipsLabel = label;
        let opac = label.node.getComponent(UIOpacity);
        opac.opacity = 0;
        tipsLabel.string = this.getArg(0);
        tipsLabel.node.setScale(1, 1, 1);
        let scl = 2.2;
        this.m_showNodes.push(label.node);
        tween(tipsLabel.node)
            .to(0.2, { scale: new Vec3(scl, scl, scl) }, { easing: 'backOut' }) // 放大
            .delay(0.5) // 延迟
            .by(1, { position: new Vec3(0, 200, 0) }, { easing: 'quadOut' })
            .to(0.3, { scale: new Vec3(1, 1, 1) }) // 恢复原大小
            .call(() => {
                //console.log("Animation ended!");
                Tween.stopAllByTarget(opac);
                Util.RemoveArrItem(this.m_showNodes, label.node);
                this.BackToPool(tipsLabel.node);
                if (this.m_showNodes.length == 0) {
                    this.hide();
                }
            })
            .start();

        tween(opac)
            .to(0.2, { opacity: 255 }, { easing: 'backOut' }) // 放大
            .delay(0.5) // 延迟
            .to(1, { opacity: 1 }, { easing: 'quadOut' }) // 上移并渐隐
            .start();

    }

    public GetColor(colorType: MsgColorType) {
        if (colorType == null)
            return this.m_Green;
        switch (colorType) {
            case MsgColorType.Green:
                return this.m_Green;
            case MsgColorType.Red:
                return this.m_Red;
            default:
                return this.m_yellow;
        }

    }

    private GetTips(): Node {
        if (this.m_tipsPool.length > 0) {
            return this.m_tipsPool.splice(0, 1)[0];
        }
        return instantiate(this.m_tip);
    }

    private BackToPool(node: Node): void {
        this.m_tipsPool.push(node);
        node.active=false;
    }

    protected onHide(): void {
        for (let i = this.m_showNodes.length - 1; i >= 0; i--) {
            Tween.stopAllByTarget(this.m_showNodes[i]);
            Tween.stopAllByTarget(this.m_showNodes[i].getComponent(UIOpacity));
        }
        this.m_showNodes = [];
    }
}

export enum MsgColorType {
    Red,
    Green,
    Yellow
}