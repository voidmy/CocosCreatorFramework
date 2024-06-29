import { _decorator, Component, input, Node,game,director, NodeEventType } from 'cc';
import WebRequestManager from './FrameWork/Net/WebRequestManager';
//import { CCHandler } from '../CocosCore.js';
import "./FrameWork/Utilities/Predefined"
import { CCHandler } from './FrameWork/Core/CCHandler';
import WebAPI from './FrameWork/Net/WebAPI';
const { ccclass, property } = _decorator;

@ccclass('Test')
export class Test extends Component {
    start() {
        //const CCHandler = require('CocosCore.js');
        var a=10;
        a++;
        game.addPersistRootNode(this.node);
        //console.log("CCHandler="+CCHandler);
        //director.loadScene("scene2");
       var  btn= this.node.getChildByPath("Canvas/windowLayer/Sprite");
       btn.on(NodeEventType.TOUCH_START,()=>{
       var a={};
       a["lzq"]="KKKK";
        WebRequestManager.Post(WebAPI.GetFullHost(WebAPI.API_TESTAAA),a,CCHandler.create(this,(response)=>{
            console.log("接口信息："+response.msg);
          }))
        console.log("ssssss==");
       });
       //window.TestLZQ();
    }

    update(deltaTime: number) {

    }
}


