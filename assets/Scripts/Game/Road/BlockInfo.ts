import { _decorator, Component, Node } from 'cc';
import { Orientation } from '../Utils/Util';
const { ccclass, property } = _decorator;


export class BlockInfo{

    public node:Node;


    // 距离
    public distance:number;

    /**
     * 方位
     */
    public orientation:Orientation
    
    public score:number=10;
}


