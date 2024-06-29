import { _decorator, Component, input, Node,game,director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Test')
export class Test extends Component {
    start() {
        var a=10;
        a++;
       // window.TestLZQ();
        console.log("==ssss"+a);
        
         console.log("==ssss");
        game.addPersistRootNode(this.node);
        //director.loadScene("scene2");

    }

    update(deltaTime: number) {

    }
}


