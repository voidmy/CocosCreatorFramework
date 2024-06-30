import { Prefab, instantiate, resources } from "cc";


export { }

declare global {
    var __ResManager: ResManager
}


 class ResManager {

    private static windowsPath: string = "Prefabs/UI/WindowUI/";

    static LoadWIndow2(winNae: string) {
        // 暂时看来cocos 只有异步加载
        //cc.assetManager.loadBundle
        //  cc.loader.loadRes
        resources.load("test assets/prefab", Prefab, (err, prefab) => {
            const newNode = instantiate(prefab);
            //this.node.addChild(newNode);
        });
    }
    public static async LoadWIndow(winName: string): Promise<Prefab> {
          return this.loadPrefab(this.GetWindowPath(winName))
        //return prefab;
    }

    private static loadPrefab(path: string): Promise<Prefab> {
        return new Promise((resolve, reject) => {
            resources.load(path, Prefab, (err, prefab) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(prefab as Prefab);
                }
            });
        });
    }


    static GetWindowPath(windName: string): string {
        return this.windowsPath + windName;
    }
}

export default ResManager;