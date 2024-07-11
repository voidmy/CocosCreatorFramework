import { _decorator, Animation, ColliderComponent, Component, director, game, geometry, input, Node, NodeEventType, ParticleSystem, physics, PhysicsSystem, Quat, RigidBody, tween, v2, v3, Vec3 } from 'cc';
import { GameManger, GameStat } from '../../FrameWork/GameManager';
import CCMessageCenter from '../../FrameWork/Core/CCMessageCenter';
import { Orientation, Util } from '../Utils/Util';
import { BlockInfo } from '../Road/BlockInfo';
import { Window_C } from '../../FrameWork/Windows/WindowMgr';
import gamefailWindow from '../../FrameWork/Windows/gamefailWindow';
import { PrecisionJump } from '../GameProp/PrecisionJump';
import { PropState, PropType } from '../GameProp/GamePropBase';

const { ccclass, property } = _decorator;

@ccclass('Role')
export class Role extends Component {

    @property({ type: Node, visible: true })
    public ANiNode: Node;
    @property({ type: Node, visible: true })
    public CameraNode: Node;
    @property({ type: Node, visible: true })
    public PlaneNode: Node;
    mouseDown: boolean = false;
    pressing: boolean = false;
    pressTime: number = 0;

    roleAadCameraV3: Vec3 = new Vec3(0, 0, 0);

    planeFarRole: Vec3 = new Vec3(0, 0, 0);

    rigidBody: RigidBody;
    isJumping: boolean = false;
    isStandOnBlock: boolean = true;
    jumpTime: number = 0.6;


    pressRatio: number = 1;
    //public float jumpTime = 1f;

    private isEntered: boolean;

    private endTag: number = 0;

    public standBlock: Node;
    public oldStandBlock: Node;

    start() {
        this.standBlock = this.node.parent.getChildByPath("Road/BlockG2");
        this.addFirstBlock();
        setTimeout(() => {
            CCMessageCenter.register(__HUDMainModule, this, this.onEvent);
        }, 1);
        let cameraPos = this.CameraNode.getPosition();
        let planePos = this.CameraNode.getPosition();
        let loPos = this.node.getPosition();

        this.roleAadCameraV3.set(loPos.x - cameraPos.x, loPos.y - cameraPos.y, loPos.z - cameraPos.z);
        this.planeFarRole.set(loPos.x - planePos.x, loPos.y - planePos.y, loPos.z - planePos.z);
        let collider = this.node.getComponent(ColliderComponent);
        if (collider) {
            collider.on('onCollisionEnter', this.onCollision, this);
        }
        this.rigidBody = this.node.getComponent(RigidBody);
    }

    addFirstBlock(): void {
        let node2 = this.node.parent.getChildByPath("Road/BlockG2");
        let data2 = new BlockInfo();
        data2.node = node2;
        data2.orientation = Orientation.Right;
        __HUDMainModule.Roads.push(data2);

        let node = this.node.parent.getChildByPath("Road/BlockG3");
        let data = new BlockInfo();
        data.node = node;
        data.orientation = Orientation.Right;
        __HUDMainModule.Roads.push(data);
    }

    update(deltaTime: number) {
        //console.log("this.mouseDown:"+this.mouseDown);
        //console.log("GameStat:"+__g.GameManger.GameStat)
        if (__GameManger.GameStat == GameStat.Playing || __GameManger.GameStat == GameStat.WaitNext) {
            //console.log("this.mouseDown:"+this.mouseDown)
            //console.log("this.pressing:"+this.pressing)
            if (this.mouseDown && !this.pressing) {
                this.StartPress();
            }
            if (this.pressing) {
                this.pressTime += deltaTime;
                this.pressRatio = this.calcPressRatio(this.pressTime);
                this.node.scale = new Vec3(1, this.pressRatio, 1);
                if (this.standBlock != null) this.standBlock.scale = new Vec3(1, this.pressRatio, 1);
                // if (pressTime >= 2.22f) SoundManager.Instance.PlaySnapLoop();
            }
        }
    }

    public StartPress(): void {
        if (this.IsReadyForJump()) {
            this.pressing = true;
            this.pressTime = 0;
            // SoundManager.Instance.PlaySnapSound();
        }

    }

    public EndPress(): void {
        if (!this.pressing) return;
        this.pressing = false;
        if (this.IsReadyForJump()) {
            //SoundManager.Instance.Stop();
            this.JumpByPressTime();
        }
    }

    private JumpByPressTime(): void {
        let jumpLength = this.pressTime * __GameCoreModule.jumpSpeed;
        let offset: Vec3 = new Vec3(1, 0, 1);
        //Vec3.zero(offset);
        if (this.standBlock != null) {
            this.judegePropStart();
            this.ResetStandScle();
            let nextBlock = __HUDMainModule.GetLastBlockInfo();
            let o: Orientation = Orientation.Forward;
            let direction: Vec3 = Util.GetOrientationVector(nextBlock.orientation); //Util.GetOrientationVector(nextBlock.orientation);;//  Util.GetOrientationVector(__HUDMainModule.GetLastBlockInfo().orientation);//
            let val = this.pressTime * __GameCoreModule.jumpSpeed;
            if (__GameCoreModule.centrJump) {
                let s = nextBlock.node.getPosition();
                let pos = this.node.position;
                offset = new Vec3(s.x - pos.x, 0, s.z - pos.z);
            } else {
                offset = new Vec3(val * direction.x, val * direction.y, val * direction.z);
            }

            if (this.pressTime < 0.1) this.pressTime = 0.1;
            //console.log(" this.pressTime:" + this.pressTime, " end:" + this.pressTime * this.jumpSpeed)
            //当玩家位置不在方块的轴线上时,会根据方向进行对应坐标的纠偏
            let pos = this.node.position;
            let nextpos = nextBlock.node.getPosition();
            let body = this.node.getChildByName("Body");
            if (nextBlock.orientation != Orientation.Forward) {
                let euler = new Vec3(0, 0, 0); // Y轴旋转0度
                let q = Quat.fromEuler(new Quat(), euler.x, euler.y, euler.z);
                body.rotation = q;
                offset.z = nextpos.z - pos.z;

            } else {
                let euler = new Vec3(0, 90, 0); // Y轴旋转90度
                let q = Quat.fromEuler(new Quat(), euler.x, euler.y, euler.z);
                body.rotation = q;
                offset.x = nextpos.x - pos.x;


            }


        }
        // console.log(`offset:x= ${offset.x}  :y= ${offset.y} :z=${offset.z}`);
        this.StartJump(offset);
    }

    private judegePropStart(): void {
        if (__GamePropModule.gamePropUses.length == 0)
            return;
        let props = __GamePropModule.gamePropUses;
        props.forEach(prop => {
            if (prop.propType == PropType.One_time) {
                prop.Use();
                prop.useOne();
            } else if (prop.propType == PropType.Step_num) {
                if (prop.State == PropState.Not_Use) {
                    prop.Use();
                } else if (prop.State == PropState.Use_Ing) {
                    if (prop.useTimes == 0) {
                        prop.UseEnd();
                    }
                }

            }

        });
    }

    private judegePropEnd(): void {
        if (__GamePropModule.gamePropUses.length == 0)
            return;
        let props = __GamePropModule.gamePropUses;

        for (let i = props.length - 1; i >= 0; i--) {
            let prop = props[i];
            if (prop.propType == PropType.One_time) {
                if (prop.useTimes == 0) {
                    prop.UseEnd();
                }
            } else if (prop.propType == PropType.Step_num) {
                prop.useOne();
                
            }

        }

    }

    private _lastPos;

    private debugLog() {
        if (!this._lastPos) {
            this._lastPos = Util.CopyVec3(this.node.position);
            return;
        }
        let endPos = this.node.position;
        console.warn("delta y:" + (endPos.y - this._lastPos.y));
        console.warn("ANiNode z:" + (this.ANiNode.position.z / 4));

    }

    public StartJump(offset: Vec3): void {
        this.jump(offset);
    }
    public jump(offset: Vec3) {
        //offset.y += 0.2;
        console.log("jump!!!");
        this.isJumping = true;
        // this.jumpPuff.active = true;
        this.isStandOnBlock = false;
        this.rigidBody.enabled = false;
        //let step: Vec3 = offset/30;
        let time: number = 0;
        let startPos: Vec3 = new Vec3(this.node.position.x, this.node.position.y, this.node.position.z); // local position
        let startPos2: Vec3 = new Vec3(startPos.x, startPos.y, startPos.z);
        //console.log(`=========startPos2:x= ${startPos2.x}  :y= ${startPos2.y} :z=${startPos2.z}`);
        let tmpoffset = new Vec3(offset.x, offset.y, offset.z);
        let roleanim: Animation = this.node.getComponent(Animation);
        roleanim.play();
        let anim: Animation = this.ANiNode.getComponent(Animation);
        this.playRoleParticle();
        this.ReSetRoleScle();
        this.endTag = 0;
        this.ResetStandScle();

        let callback = () => {
            if (time > this.jumpTime) {
                //console.log(`startPos2:x= ${startPos2.x}  :y= ${startPos2.y} :z=${startPos2.z}`);
                //this.node.position=(startPos2.add(offset));
                //this.node.position = new Vec3(startPos2.x + offset.x,  this.node.position.y, startPos2.z + offset.z);
                this.node.position = new Vec3(startPos2.x + offset.x, startPos2.y + offset.y, startPos2.z + offset.z);
                //this.node.position=new Vec3(startPos2.x,startPos2.y,startPos2.z);
                //console.log(`offset2222:x= ${offset.x}  :y= ${offset.y} :z=${offset.z}`);
                let q2: Quat = new Quat(0, 0, 0)
                this.node.setRotation(q2); // body.eulerAngles
                //this.jumpPuff.active = false;
                this.rigidBody.enabled = true;
                let endPos = this.node.position;
                // console.log(`endPos:x= ${endPos.x}  :y= ${endPos.y} :z=${endPos.z}`);
                this.pressTime = 0;
                console.log("结束了跳跃  endTag:" + this.endTag);
                this.endTag++;
                if (this.endTag > 1) {
                    //this.isJumping = false;
                }
                let rigidBody = this.node.getComponent(RigidBody);
                if (rigidBody) {
                    // rigidBody.clearVelocity(); // 设置线性速度为0
                    rigidBody.setAngularVelocity(new Vec3(0, 0, 0)); // 设置角速度为0
                }
                this.checkIfCollisionIsAbove();
                this.unschedule(callback); // remove the scheduler once done
                //this.debugLog();
            } else {
                let detime = time / this.jumpTime;
                //console.log("detime:" + detime)
                startPos.set(startPos2.x, startPos2.y, startPos2.z);
                //console.log("detime:" + detime);
                //console.log(`offset:x= ${offset.x}  :y= ${offset.y} :z=${offset.z}`);
                tmpoffset.set(offset.x, offset.y, offset.z);
                //  console.log(`tmpoffset :x= ${tmpoffset.x}  :y= ${tmpoffset.y} :z=${tmpoffset.z}`);
                let newoffSet = tmpoffset.multiplyScalar(detime)
                //  console.log(`newoffSet==== :x= ${newoffSet.x}  :y= ${newoffSet.y} :z=${newoffSet.z}`);
                // console.log("startPos2.y:" + startPos2.y);
                newoffSet.y = startPos2.y + (this.ANiNode.position.z / __GameCoreModule.jumpHightScale);
                // console.log("anim.node.z:" + this.ANiNode.position.z);
                //console.log(`newoffSet:x= ${newoffSet.x}  :y= ${newoffSet.y} :z=${newoffSet.z}`);
                // let newPosition: Vec3 = startPos.add(newoffSet);
                let newPosition: Vec3 = new Vec3(startPos.x + newoffSet.x, newoffSet.y, startPos.z + newoffSet.z)// ;startPos.add(newoffSet);
                // newPosition.y = this.jumpCurve.evaluate(time / this.jumpTime) * this.jumpHeight;
                // console.log(`newPosition==== :x= ${newPosition.x}  :y= ${newoffSet.y} :z=${newoffSet.z}`);
                //newPosition.x=startPos2.x;
                this.node.position = (newPosition);
                // console.log(`framposition :x= ${newPosition.x}  :y= ${newPosition.y} :z=${newPosition.z}`);
                let rotationAngle = (time / this.jumpTime) * 360;
                //let q2: Quat = new Quat(0, 0, 0)
                //this.node.setRotation(q2);
                //this.debugLog();
                time += game.deltaTime;
            }
        }
        anim.play();
        this.schedule(callback, 0); // schedule the function, 0 to run it every frame
    }
    curve(pos, time): number {
        let anim: Animation = this.ANiNode.getComponent(Animation);
        anim.getState
        return 0;
    }

    private calcPressRatio(pressTime): number {
        return Math.exp(-pressTime) * (1 - __GameCoreModule.maxPressRatio) + __GameCoreModule.maxPressRatio;
    }

    private playRoleParticle(): void {
        let node = this.node.getChildByPath("Body/JumpPuff/Particle");
        let particle = node.getComponent(ParticleSystem);
        particle.play();
    }


    public IsReadyForJump(): boolean {
        return (!this.isJumping) && this.isStandOnBlock;
        // return isEntered && !isJumping && isStandOnBlock;
    }

    public ReSetRole(): void {
        console.log("ReSetRole");
        this.ReSetRoleScle();
        this.node.setPosition(0, 3.6, 0.7);
        this.node.setRotation(0, 0, 0, 0);
        this.SetCameraPos(false);
        this.SetPlanepos();
        this.rigidBody.enabled = true;
    }

    private ReSetRoleScle() {
        this.node.scale = new Vec3(1, 1, 1);
    }

    private SetCameraPos(istween: boolean = true): void {
        let cameraPos = this.CameraNode.getPosition();
        let loPos = this.node.getPosition();
        let dis = this.roleAadCameraV3;
        //let posX=__GameCoreModule.GetCamerPos();
        let lastNode = __HUDMainModule.GetLastBlockInfo();
        let endPos;
        console.log("lastNode.orientation:" + lastNode.orientation);
        // console.log("posX==:"+posX);


        if (!istween) {
            this.CameraNode.setPosition(new Vec3(loPos.x - dis.x, cameraPos.y, loPos.z - dis.z));
            return;
        }
        let disX = 5;
        if (lastNode.orientation == Orientation.Forward) {
            console.log("__GameCoreModule.GetCamerPosY():" + __GameCoreModule.GetCamerPosY());
            endPos = new Vec3(loPos.x - dis.x, cameraPos.y, loPos.z - dis.z - __GameCoreModule.GetCamerPosY() / 2 - disX);
        } else {
            console.log("__GameCoreModule.GetCamerPosX():" + __GameCoreModule.GetCamerPosX());
            endPos = new Vec3(loPos.x - dis.x + __GameCoreModule.GetCamerPosX() / 2 + 1, cameraPos.y, loPos.z - dis.z - __GameCoreModule.GetCamerPosY() / 2);
        }
        let dist = Vec3.distance(cameraPos, endPos);
        tween(this.CameraNode)
            .to(__GameCoreModule.GetCamerMoveTime(), { position: endPos }, { easing: 'cubicOut' }) // 缩放到1并应用缓动
            .call(() => {
                //this.birthComplete();
            })
            .start();
    }

    private SetPlanepos(): void {


        let planePos = this.PlaneNode.getPosition();
        let loPos = this.node.getPosition();
        let dis = this.planeFarRole
        this.PlaneNode.setPosition(new Vec3(loPos.x - dis.x, planePos.y, loPos.z - dis.z));
    }


    private SetStandblock(): void {
        if (!this.standBlock) return;

        this.ResetStandScle();
        this.standBlock = __HUDMainModule.GetLastTwoBlockInfo().node;
    }

    private SetGameState(): void {
        __GameManger.GameStat = GameStat.Playing;
    }

    public ReSetstandBlock(): void {
        this.standBlock = this.node.parent.getChildByPath("Road/BlockG2");
        this.ResetStandScle();
    }

    private ResetStandScle(): void {
        this.standBlock.scale = new Vec3(1, 1, 1);
    }


    onMouseDown() {
        this.mouseDown = true;
    }
    onMouseUp() {
        this.mouseDown = false;
        this.EndPress();
    }

    addEffectt(name: string): void {

    }

    removeEffect(name: string): void {

    }

    onEvent(e) {
        switch (e) {
            case __HUDMainModule.HUDMain_MOUSE_DOWN:
                this.onMouseDown();
                break;
            case __HUDMainModule.HUDMain_MOUSE_UP:
                this.onMouseUp();
                break;
            case __HUDMainModule.HUDMain_START_Game:

                this.ReSetRole();
                this.ReSetstandBlock();
                this.SetGameState();
                break;
            case __HUDMainModule.HUDMain_NEXT_CUBE_COMPLETE:
                //this.SetStandblock();
                __GameManger.GameStat = GameStat.Playing;
                break;
            case __HUDMainModule.HUDMain_NEXT_CUBE_PUSH:
                this.SetCameraPos();
                break;
            case __GamePropModule.GamePropModule_UES_PrecisionJump:


                break;
        }
    }

    onCollision(event) {
        let otherCollider = event.otherCollider;
        //let selfCollider = event.selfCollider;
        let spendV: Vec3 = new Vec3(0, 0, 0);
        this.rigidBody.getLinearVelocity(spendV);
        // console.log("spendV.y:"+spendV.y);
        if (spendV.y > 1) return;

        if (otherCollider.node.name == "Plane") {
            this.checkGameOver();
            return;
        }
        this.checkWaitNextCube(otherCollider.node);
    }

    checkWaitNextCube(nowNode: Node): void {
        if (nowNode.name == "Cube-004") {
            //return;
            nowNode = nowNode.parent;
        }
        console.log("碰撞了 name:" + nowNode.name);
        /*if(!this.checkIfCollisionIsAbove(this.node,nowNode)){
            console.log("碰撞了 但方向不对:");
            return;
        }*/
        if (__GameManger.GameStat == GameStat.Playing) {

            let lastBlock = __HUDMainModule.GetLastBlockInfo();
            // console.log(" __HUDMainModule.GetLastBlockInfo().node===:" + __HUDMainModule.GetLastBlockInfo().node.name);
            if (nowNode === lastBlock.node && __GameManger.GameStat == GameStat.Playing) {

                this.jumpOneSuccess(lastBlock);
                this.WaitNextCube();
                this.SetPlanepos();
                this.isStandOnBlock = true;
                this.standBlock = nowNode;

            } else if (nowNode === __HUDMainModule.GetLastTwoBlockInfo().node) {
                console.log("碰撞了旧的 this.endTag:" + this.endTag);
                this.endTag++;
                this.isStandOnBlock = true;
                if (this.endTag > 1) {
                    this.standBlock = nowNode;
                    this.isJumping = false;
                }
            }

        }
    }



    checkIfCollisionIsAbove() {
        let start = this.node.worldPosition; // 刚体所在的节点位置
        start = new Vec3(start.x, start.y + 2.5, start.z);
        let end = new Vec3(this.node.worldPosition.x, this.node.worldPosition.y - 1000, this.node.worldPosition.z); // 终点设为刚体垂直向下1000个单位
        let sub = Vec3.subtract(new Vec3(), end, start);
        let ray = new geometry.Ray();
        geometry.Ray.set(ray, start.x, start.y, start.z, sub.x, sub.y, sub.z);

        let r = physics.PhysicsSystem.instance.raycast(ray);

        if (r) {
            const results = PhysicsSystem.instance.raycastResults;

            for (let i = 0; i < results.length; i++) {
                const result = results[i];
                const collider = result.collider;
                const distance = result.distance;
                const hitPoint = result.hitPoint;
                const hitNormal = result.hitNormal;
                console.log("collider ===")
                console.log(collider.node.name);
            }
        }
    }

    jumpOneSuccess(block: BlockInfo): void {
        let score = __GameCoreModule.ComputeSocre(block);
        this.judegePropEnd();
        __HUDMainModule.AddScore(score);
        __HUDMainModule.send(__HUDMainModule.HUDMain_REFRESH_UI);
    }

    WaitNextCube(): void {
        __GameManger.GameStat = GameStat.WaitNext;
        this.isJumping = false;
        __HUDMainModule.send(__HUDMainModule.HUDMain_WAITNEXT_CUBE);

    }
    checkGameOver(): void {
        if (__GameManger.GameStat == GameStat.Playing || __GameManger.GameStat == GameStat.WaitNext) {
            this.gameOver();
        }
    }
    /**
     * 游戏结束
     */
    gameOver(): void {
        __GameManger.GameStat = GameStat.GameOver;
        this.isJumping = false;
        this.isStandOnBlock = true;
        Window_C.Show<gamefailWindow>(gamefailWindow);
    }

    protected onDisable(): void {
        this.ReSetRole();
        this.ReSetstandBlock();
    }

}


