import { Vec2, Vec3 } from "cc";
import Module from "../ModuleManager";
import { BlockInfo } from "../../Game/Road/BlockInfo";
import { Window_C } from "../Windows/WindowMgr";

export default class GameCoreModule extends Module {


    /**
     * 是否开启 精准跳跃，下一次必定跳到下一个方块中心
     */
    public centrJump: boolean = true;

     

    /**
     * 出生方块下落实际
     */
    public birthFalltime: number = 0.6;

    // 随机距离上一个方块的距离
    public roadMaxAdd: number = 12;
    public roadMinAdd: number = 6;

    /**
 * 出生高度
 */
    public birthHight: number = 12;

    /**
     * 跳跃高度缩放， 越大跳的越低， 不能为0
     */
    public jumpHightScale: number = 1.8;


    /// <summary>
    /// 按压最大压缩比(仅高度)
    /// </summary>
    public maxPressRatio: number = 0.6;

    /// <summary>
    /// 跳跃速度(按压一秒跳跃的距离)
    /// </summary>
    public jumpSpeed: number = 20;

    public cameraMoveSpeed: number = 6;// 距离越远越慢， 先块后慢，、 相机两条轴线

    public ComputeSocre(blockData: BlockInfo): number {
        let score = blockData.score;
        // 计算其它加成
        return score;
    }

    public GetCamerPosX(): number {

        let endBlock = __HUDMainModule.GetLastBlockInfo();
        let endTBlock = __HUDMainModule.GetLastTwoBlockInfo();
        return endBlock.node.getPosition().x - endTBlock.node.getPosition().x;
    }

    public GetCamerPosY(): number {

        let endBlock = __HUDMainModule.GetLastBlockInfo();
        let endTBlock = __HUDMainModule.GetLastTwoBlockInfo();
        return endBlock.node.getPosition().y - endTBlock.node.getPosition().y;
    }


    public GetlastTwoDistance(): number {

        let endBlock = __HUDMainModule.GetLastBlockInfo();
        let endTBlock = __HUDMainModule.GetLastTwoBlockInfo();

        return Vec2.distance(new Vec2(endBlock.node.position.x, endBlock.node.position.z), new Vec2(endTBlock.node.position.x, endTBlock.node.position.z));
    }

    public GetCamerMoveTime(): number {
        return __GameCoreModule.cameraMoveSpeed / Math.pow(__GameCoreModule.GetlastTwoDistance(), 1.2);
    }

}
