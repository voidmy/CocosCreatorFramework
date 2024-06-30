
import { _decorator, Component, input, Node,game,director, NodeEventType } from 'cc';
import '../FrameWork/Global';
import '../FrameWork/Utilities/Predefined';
import '../FrameWork/AutoGenerated/Modules';
import { GameManger } from '../FrameWork/GameManager';
import {  Window_C } from '../FrameWork/Windows/WindowMgr';
import loginWindow from '../FrameWork/Windows/loginWindow';
const { ccclass, property } = _decorator;


@ccclass('Launch')
export class Launch extends Component {
    @property({type:Node,visible:true})
    public UIRoot:Node;

    onLoad(){
        game.addPersistRootNode(this.node);
        __g.GameManger=new GameManger();
        __g.GameManger.InitModule();
        Window_C.SetUIRoot(this.UIRoot);
        game.addPersistRootNode(this.UIRoot);
       // console.log(" loginWindow.toString():"+loginWindow.) ;
        Window_C.Show<loginWindow>(loginWindow).then(()=>{console.log("Window_C.Show<loginWindow> 222success")});
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}


