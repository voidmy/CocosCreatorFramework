import { _decorator, Component, Node } from 'cc';

export class GamePropBase {

    public State: PropState = PropState.Not_Use;
    public propType: PropType = PropType.One_time;

    /**结束时间 时间戳 */
    public endtime: number = 0;

    /**时间差秒 */
    public seconds: number = 0;

    /**使用次数*/
    public useTimes: number = 0;

    /**增加的积分 */
    public addScore: number = 0;

    Use(): void {
        this.State = PropState.Use_Ing;
    }

    useOne(): void {
        this.useTimes--;
    }

    UseEnd(): void {

        this.State = PropState.Use_End_UP;
    }

}

export enum PropState {
    /**
     * 未使用
     */
    Not_Use,
    /**
     * 使用中
     */
    Use_Ing,
    /**
     * 使用完
     */
    Use_End_UP,
}

/**道具类型 枚举 */
export enum PropType {
    /**
     * 一次性跳跃道具
     */
    One_time,

    /**
     * 步数道具
     */
    Step_num,
    /**
     * 持续时间
     */
    duration
}
