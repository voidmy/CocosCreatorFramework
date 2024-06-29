import { _decorator, Component, input, Node,game,director, NodeEventType } from 'cc';
import WebRequestManager from './FrameWork/Net/WebRequestManager';
const { ccclass, property } = _decorator;

@ccclass('Test')
export class Test extends Component {
    start() {
        var a=10;
        a++;
        game.addPersistRootNode(this.node);
        //director.loadScene("scene2");
       var  btn= this.node.getChildByPath("Canvas/windowLayer/Sprite");
       btn.on(NodeEventType.TOUCH_START,()=>{
        WebRequestManager.Get("http://10.10.103.228:3000",null,CCHandler.create(this,(response)=>{
            console.log(response);
          }))
        console.log("ssssss==");
       });

    }

    update(deltaTime: number) {

    }
}


