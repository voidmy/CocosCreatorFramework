
import { Director, Prefab, Node, instantiate, resources, JsonAsset } from 'cc';

export class TestConfig {

     public readonly ID: number;
public readonly Type: string;
public readonly EventID: number;
public readonly Name: string;
public readonly drap: ReadonlyArray<number>[];
public readonly award: ReadonlyArray<number>[][];


    constructor(item: any) {
        this.ID = item.ID;
this.Type = item.Type;
this.EventID = item.EventID;
this.Name = item.Name;
this.drap = item.drap;
this.award = item.award;

    }

    private static _dict = {  };
    public static Get(ID: number) {
        return this._dict[ID];
    }
    public static load():Promise<boolean>{
        return new Promise((resolve, reject) => { 
        resources.load('Json/Test', (err, aset) => {
            if(err){
                console.log(err.message);
                reject(false);
                return;
            };
            let assetobj = aset as JsonAsset;
            let json = assetobj.json;
            json.forEach(item => {
                let cf = new TestConfig(item);
                this._dict[item.ID] = cf;
             });
             resolve(true);
            });
         });
     }
}