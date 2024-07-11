import { _decorator, Component, Node } from 'cc';
import '../FrameWork/Global'
import {ModuleManager} from './ModuleManager';
import Module_test from './Modules/TestModule';
import ResManager from './Res/ResManager';
import HUDMainModule from './Modules/HUDMainModule';
import { Window_C } from './Windows/WindowMgr';
import startWindow from './Windows/startWindow';
import GameCoreModule from './Modules/GameCoreModule';
import GamePropModule from './Modules/GamePropModule';
const { ccclass, property } = _decorator;

declare global{
    const __GameManger:GameManger
}
export class  GameManger {

    private _gameState:GameStat=GameStat.Playing;
    public set GameStat(gamestate:GameStat){
        console.log("set gamestate:"+gamestate);
        this._gameState=gamestate
    };

    public get GameStat(){
        return this._gameState;
    };


    InitModule(){
        var _m = new ModuleManager();
        __g._m=_m;
        __g.__manager = _m;
        __g.__TestModule=new Module_test("Module_test",'__TestModule');
        __g.__HUDMainModule=new HUDMainModule("HUDMainModule",'__HUDMainModule');
        __g.__GameCoreModule=new GameCoreModule("GameCoreModule","__GameCoreModule");
        __g.__GamePropModule=new  GamePropModule("GamePropModule","__GamePropModule");
        __g.__ResManager=new ResManager();
        __manager;
        console.log("Init Module Success!!!");
    }

    public BackStartWindow():void{
        Window_C.HideAll();
        Window_C.Show<startWindow>(startWindow);
    }

}

export  enum GameStat {
    Loaded,
    Playing,
    WaitNext,
    GameOver,
};

