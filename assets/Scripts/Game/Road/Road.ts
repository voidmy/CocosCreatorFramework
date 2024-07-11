import { _decorator, Component, instantiate, Node, Prefab, tween, Vec3 } from 'cc';
import ResManager from '../../FrameWork/Res/ResManager';
import { BlockInfo } from './BlockInfo';
import { Orientation, Util } from '../Utils/Util';
import CCMessageCenter from '../../FrameWork/Core/CCMessageCenter';
import { GameStat } from '../../FrameWork/GameManager';
const { ccclass, property } = _decorator;

@ccclass('Road')
export class Road extends Component {



    //@property({ type: Node, visible: true })
    //public cube2: Node;
    protected onLoad(): void {
        this.loadAllcube();
    }

    start() {
        setTimeout(() => {
            CCMessageCenter.register(__HUDMainModule, this, this.onEvent);
        }, 1);
    }

    update(deltaTime: number) {

    }

    /**
     * 由于异步的原因 提前加载所有的cube
     */
    private loadAllcube(): void {

    }

    public birthOneCube(data: BlockInfo): void {
        let preData = this.GetLastButOne();
        let nowNode = data.node;
        this.node.addChild(nowNode);
        let o = preData.node.position;
        let prePos = new Vec3(o.x, o.y, o.z);
        prePos.y += __GameCoreModule.birthHight;
        if (data.orientation == Orientation.Right) {
            prePos.x += data.distance;
        } else {
            prePos.z -= data.distance
        }
        nowNode.position = prePos;
        __HUDMainModule.send(__HUDMainModule.HUDMain_NEXT_CUBE_PUSH);
        tween(nowNode)
            .to(__GameCoreModule.birthFalltime, { position: new Vec3(prePos.x, o.y, prePos.z) }, { easing: 'bounceOut' }) // 缩放到1并应用缓动
            .call(() => {
                this.birthComplete();
            })
            .start();
    }

    private birthComplete() {
        if(__GameManger.GameStat == GameStat.WaitNext)
            __HUDMainModule.send(__HUDMainModule.HUDMain_NEXT_CUBE_COMPLETE);
    }

    /**
     * 得到倒数第二个BlockInfo
     */
    private GetLastButOne(): BlockInfo {

        return __HUDMainModule.Roads[__HUDMainModule.Roads.length - 2];
    }

    public CreateNextCube(): void {
        let name: string = "BlockG2";
        this.addNextCube(name).then((node: Node) => {
            let data = new BlockInfo();
            this.setRoadCubeData(data, node);
            __HUDMainModule.Roads.push(data);
           
            this.birthOneCube(data);
        })
    }

    public addNextCube(name: string): Promise<Node> {

        // 这里计算加载那个cube
        return new Promise((resolve, reject) => {

            let node = ResManager.GetCubeNodeDic(name) as Node;
            if (node == null) {
                ResManager.LoadCube(name).then((result) => {
                    let cube = instantiate(result);
                    resolve(cube);
                }).catch((e) => {
                    console.error("加载 cube error");
                    console.error(e);
                });
            } else {

                resolve(node as Node);
            }
        });
        //return ResManager.LoadCube("BlockG2");
    }

    private setRoadCubeData(data: BlockInfo, node: Node) {
        data.node = node;
        data.distance = Util.getRandomArbitrary(__GameCoreModule.roadMinAdd, __GameCoreModule.roadMaxAdd);
        data.orientation = Util.getRandomArbitrary(0, 1) > 0.5 ? Orientation.Forward : Orientation.Right;
        //data.orientation= Orientation.Right ;
        //data.distance=12;
    }

    private Clearblock(): void {
        let blocks = __HUDMainModule.Roads;

        for (let i = blocks.length - 1; i > 1; i--) {
            let data: BlockInfo = blocks[i];
            blocks.splice(i, 1);
            data.node.destroy();
        }
    }

    onEvent(e): void {
        switch (e) {
            case __HUDMainModule.HUDMain_WAITNEXT_CUBE:
                this.CreateNextCube();
                break;
            case __HUDMainModule.HUDMain_START_Game:
                this.Clearblock();
                break;
        }
    }
}


