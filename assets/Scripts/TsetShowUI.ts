import { _decorator, Component, Node, NodeEventType } from 'cc';
import { Window_C } from './FrameWork/Windows/WindowMgr';
import loginWindow from './FrameWork/Windows/loginWindow';
const { ccclass, property } = _decorator;

@ccclass('TsetShowUI')
export class TsetShowUI extends Component {
    start() {
        this.node.on(NodeEventType.TOUCH_START,()=>{
            Window_C.Show<loginWindow>(loginWindow);
        });
    }

    update(deltaTime: number) {
        
    }
}


