import { Director, Prefab,Node, instantiate, resources } from "cc";


export { }

declare global {
    var __ResManager: ResManager
}


class ResManager {

    private static windowsPath: string = "Prefabs/UI/WindowUI/";
    private static cubesPath: string = "Prefabs/Cubes/";
    private static CubeDicCache: { [key: string]: Node; } = {};
    private static PrefabDicCache: { [key: string]: Prefab; } = {};
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

    public static async LoadCube(cubeName: string): Promise<Prefab> {
        return this.loadPrefab(this.GetCubePath(cubeName))
        //return prefab;
    }

    private static loadPrefab(path: string): Promise<Prefab> {
        if (this.PrefabDicCache[path]) {
            return new Promise((resolve, reject) => {
                resolve(this.PrefabDicCache[path] as Prefab);
            });
        };
        return new Promise((resolve, reject) => {
            resources.load(path, Prefab, (err, prefab) => {
                if (err) {
                    reject(err);
                } else {
                    this.PrefabDicCache[path]=prefab;
                    resolve(prefab as Prefab);
                }
            });
        });
    }


    static GetWindowPath(windName: string): string {
        return this.windowsPath + windName;
    }

    static GetCubePath(windName: string): string {
        return this.cubesPath + windName;
    }

    public static AddCubeNodeDic(name: string, node: Node) {
        if (!this.CubeDicCache[name]) {
            this.CubeDicCache[name] = node;
        }
    }

    public static GetCubeNodeDic(name: string): Node {
        if (!this.CubeDicCache[name]) {
            return null;
        }
        return this.CubeDicCache[name];
    }
}

export default ResManager;