import GameCoreModule from "../Modules/GameCoreModule"
import GamePropModule from "../Modules/GamePropModule";
import HUDMainModule from "../Modules/HUDMainModule"
import Module_test from "../Modules/TestModule"


export {}

declare global{
    const __TestModule:Module_test;
    const __HUDMainModule:HUDMainModule;
    const __GameCoreModule:GameCoreModule;
    const __GamePropModule:GamePropModule;
}
