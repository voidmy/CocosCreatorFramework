import { _decorator, tween, instantiate, Node, v2, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;
import "../Res/ResManager";
import ResManager from '../Res/ResManager';
import CCMessageCenter from '../Core/CCMessageCenter';
export enum WindowType {
    FullScreen,
    Popup,
    Global,
}


export class Window_C {
    private static m_UIRoot: Node;

    private static map = new Map<any, Window_C>();
    private static globalWindows: Array<Window_C> = [];
    private static popupWindows: Array<Window_C> = [];
    private static windows: Array<Window_C> = [];

    private static m_windowLayer: Node;


    isShowing: boolean;

    type: WindowType = WindowType.FullScreen;
    windowName: string;
    defaultAnim: boolean;
    needBgMask: boolean;
    needBgClick: boolean;
    windowNode: Node;
    BgNode: Node;
    /*
    是否应用打开关闭动画
    */
    isApplyAni: boolean = true;

    /*
   是否在关闭的时候就摧毁，不缓存
   */
    immediatedestroy: boolean = false;
    constructor() {
        this.windowName = this.constructor.name;
        //console.log(" this.windowName :"+  this.constructor.name);
        //console.log(  this);
        this.initialization();
    }


    private static getCache(w: any) {
        if (!this.map.has(w)) {
            this.map.set(w, new w());
        }
        return this.map.get(w);
    }

    public static GetWindow<T extends Window_C>(w: new () => T): Window_C {
        var ww = this.getCache(w);
        let idx = this.globalWindows.findIndex(gw => gw.windowName == ww.windowName);
        if (idx > -1)
            return this.globalWindows[idx];
        idx = this.popupWindows.findIndex(gw => gw.windowName == ww.windowName);
        if (idx > -1)
            return this.popupWindows[idx];
        idx = this.windows.findIndex(gw => gw.windowName == ww.windowName);
        if (idx > -1)
            return this.windows[idx];
        return undefined;
    }


    public static SetUIRoot(uiroot: Node) {
        this.m_UIRoot = uiroot;
        this.m_windowLayer = uiroot.getChildByPath("Canvas/windowLayer");
        console.log("SetUIRoot success!!!");
    }

    private m_args: any[];
    public getArg<T>(index: number) {
        if (index >= 0 && index < this.m_args.length)
            return this.m_args[index] as T;
        return undefined;
    }
    private SetArgs(args: any[]) {
        this.m_args = args;
    }
    /**
    * 显示一个窗口 注意是异步的 ,预制中bg 名称会当背景遮罩出来
    * @param w 窗口类型
    * @param args 需要传递到窗口的参数
    */
    public static async Show<T extends Window_C>(w: new () => T, ...args: any[]): Promise<Window_C> {
        return new Promise((resolve, reject) => {
            //var ww = new w();
            var ww = this.getCache(w);
            let idx = this.globalWindows.findIndex(gw => gw.windowName == ww.windowName);
            if (idx > -1) {
                var globalwin = this.globalWindows[idx];
                globalwin.SetArgs(args);
                //this.globalWindows[idx].show();
                // return this.globalWindows[idx];
                globalwin.windowNode.parent.addChild(globalwin.windowNode);
                globalwin.show();
                resolve(globalwin)
            }
            idx = this.windows.findIndex(gw => gw.windowName == ww.windowName);
            if (idx > -1) {
                for (var i = 0; i < this.popupWindows.length; i++) {
                    // 关闭所有Windows[
                    this.popupWindows[i].hideImmediately();
                }
                if (this.windows[idx].isShowing) {
                    this.windows[idx].SetArgs(args);
                    this.windows[idx].show();
                    return this.windows[idx];
                }
                if (this.windows.length > 0 && this.windows.length - 1 != idx) {
                    let ww = this.windows[this.windows.length - 1];
                    ww.hideImmediately();
                }
                let arr = this.windows.splice(idx, 1);
                let _w = arr[0];
                _w.SetArgs(args);
                _w.show();
                this.windows.push(_w);
                return _w;
            }
            ww = new w();
            if (ww.type == WindowType.Global)
                this.globalWindows.push(ww);
            else if (ww.type == WindowType.Popup)
                this.popupWindows.push(ww);
            else if (ww.type == WindowType.FullScreen)
                this.windows.push(ww);
            ww.SetArgs(args);
            ResManager.LoadWIndow(w.name).then((Prefab) => {
                let node = instantiate(Prefab);
                this.m_windowLayer.addChild(node);
                ww.windowNode = node;
                ww.onOpened();
                ww.show();

                resolve(ww);

            }).catch((err) => { console.error(err); });
        });
    }

    hideImmediately() {
        this.isShowing = false;
        this.SetBgEnd();
        this.SetActive(false);
        if (this.immediatedestroy) {
            Window_C.DelWindow(this);
        }

    }
    private static DelWindow(w: Window_C) {
        if (!w || w.isShowing)
            return;
        switch (w.type) {
            case WindowType.FullScreen:
                {
                    let idx = this.windows.findIndex(gw => gw.windowName == w.windowName);
                    if (idx > -1) {
                        this.windows.splice(idx, 1);
                        w.dispose();
                        return;
                    }
                }
                break;
            case WindowType.Popup:
                {
                    let idx = this.popupWindows.findIndex(gw => gw.windowName == w.windowName);
                    if (idx > -1) {
                        this.popupWindows.splice(idx, 1);
                        w.dispose();
                        return;
                    }
                }
                break;
            default:
                {
                    let idx = this.globalWindows.findIndex(gw => gw.windowName == w.windowName);
                    if (idx > -1) {
                        this.globalWindows.splice(idx, 1);
                        w.dispose();
                        return;
                    }
                }
                break;
        }
    }

    SetActive(vis: boolean): void {
        this.windowNode.active = vis;
    }

    show(): void {
        this.SetBgStart();
        this.isShowing = true;
        console.log("===  show");
        this.SetActive(true);
        this.onBindData();
        this.doShowAnimation();
    }

    hide(): void {
        this.SetBgStart();
        this.doHideAnimation();
        //this.doShowAnimation();
    }
    dispose(): void {
        console.log("===  destroy node name:" + this.windowNode.name);
        this.windowNode.destroy();
    }


    protected doShowAnimation() {

        this.onBindData();
        this.regirestModuleEvent();
        if (!this.isApplyAni) {
            this.showAnimationComplete();
            return;
        }
        this.windowNode.setScale(0, 0);

        tween(this.windowNode)
            .to(0.4, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' }) // 缩放到1并应用缓动
            .call(() => {
                this.showAnimationComplete();
            })
            .start(); // 开始动画
    }

    protected doHideAnimation() {


        if (!this.isApplyAni) {
            this.HideAnimationComplete();
            return;
        }
        tween(this.windowNode)
            .to(0.4, { scale: new Vec3(0.2, 0.2, 0.2) }, { easing: 'backIn' })
            .call(() => {
                this.HideAnimationComplete();
            })
            .start(); // 开始动画
    }

    private showAnimationComplete() {
        this.SetBgEnd();
        this.onShown();
    }

    private HideAnimationComplete() {
        this.SetBgEnd();
        this.onHide();
        CCMessageCenter.remove(this);
        this.hideImmediately();
    }
    private regirestModuleEvent() {
        CCMessageCenter.remove(this);
        __manager.Foreach((m: any) => {
            let me = this[m.identifier];
            me && CCMessageCenter.register(m, this, me);
        });
    }

    private SetBgStart():void{
        let bg = this.windowNode.getChildByName("bg");
        if (bg) {
            let index = this.windowNode.getSiblingIndex();
            bg.parent.parent.insertChild(bg, index);
            this.BgNode = bg;
        }
    }

    private SetBgEnd():void{
        if (this.BgNode) {
            this.windowNode.insertChild(this.BgNode, 0);
            this.BgNode=null;
        }
    }


     /**
    * 窗口被打开事件，该事件只会在窗口加载完成后调用一次
    */
    protected onOpened() { }
    /**
     * 重载此方法为窗口绑定界面数据，该方法在窗口动画之前调用
     */
    protected onBindData() { }

    /**
     * 窗口显示事件，窗口动画播放完成后调用
     */
    protected onShown() {

    }

     /**
     * 窗口隐藏事件，动画完成后调用
     */
    protected onHide() {

    }

    /**
     * 初始化调用，设置是否应用动画，window 类型等
     */
    protected initialization() {

    }
}

