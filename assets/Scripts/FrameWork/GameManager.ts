import { _decorator, Component, Node } from 'cc';
import '../FrameWork/Global'
import {ModuleManager} from './ModuleManager';
import Module_test from './Modules/TestModule';
import ResManager from './Res/ResManager';
const { ccclass, property } = _decorator;

export class  GameManger {


    InitModule(){
        var _m = new ModuleManager();
        __g.__manager = _m;
        __g.__TestModule=new Module_test("Module_test",'__TestModule');
        __g.__ResManager=new ResManager();
        console.log("Init Module Success!!!");
    }

}


