import { BlockInfo } from "../../Game/Road/BlockInfo.js";
import Module from "../ModuleManager";

export default class HUDMainModule extends Module {


    public readonly HUDMain_MOUSE_DOWN = "HUDMainModule_MOUSE_DOWN";
    public readonly HUDMain_MOUSE_UP = "HUDMainModule_MOUSE_UP";
    public readonly HUDMain_START_Game = "HUDMainModule_StartGame";

    /**
     * 等待加载下一个cube 开始
     */
    public readonly HUDMain_WAITNEXT_CUBE = "HUDMainModule_WaitNextCube";

    /**
 * 下一个加载cube 加入到数组中
 */
    public readonly HUDMain_NEXT_CUBE_PUSH = "HUDMainModule_nextcubePush";

    /**
     * 下一个加载cube完成
     */
    public readonly HUDMain_NEXT_CUBE_COMPLETE = "HUDMainModule_nextcubecomplete";

    /**
     * 刷新HUDMainUI
     */
    public readonly HUDMain_REFRESH_UI = "HUDMainModuleRefreshUI";

    public Roads: BlockInfo[] = [];

    private m_socre: number = 0;

    public GetScore(): number {
        return this.m_socre;
    }

    public SetScore(val: number) {
        this.m_socre = val;
    }

    public AddScore(val: number): number {
        this.m_socre += val;
        return this.m_socre;
    }

    public ResetScoreData(): void {
        this.m_socre=0;
    }

    /**
     * 
     * @returns 倒数第一个block
     */
    public GetLastBlockInfo(): BlockInfo {
        return this.Roads[this.Roads.length - 1];
    }

    /**
     * 
     * @returns 倒数第二个block
     */
    public GetLastTwoBlockInfo(): BlockInfo {
        return this.Roads[this.Roads.length - 2];
    }

    /**
 * 
 * @returns 倒数第三个block
 */
    public GetLastThreeBlockInfo(): BlockInfo {
        return this.Roads[this.Roads.length - 3];
    }

}
