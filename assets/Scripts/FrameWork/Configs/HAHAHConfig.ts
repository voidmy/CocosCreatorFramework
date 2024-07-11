
import { Director, Prefab, Node, instantiate, resources, JsonAsset } from 'cc';

export class HAHAHConfig {

     public readonly ID: string;
public readonly Type: string;
public readonly EventID: number;
public readonly Name: string;
public readonly drap: ReadonlyArray<number>[];
public readonly award: ReadonlyArray<number>[][];
public readonly desc_th: string;
public readonly desc_ja: string;
public readonly desc_en: string;

     public get desc(){return this["desc_"+__L10n];}


    constructor(item: any) {
        this.ID = item.ID;
this.Type = item.Type;
this.EventID = item.EventID;
this.Name = item.Name;
this.drap = item.drap;
this.award = item.award;
this.desc_th = item.desc_th;
this.desc_ja = item.desc_ja;
this.desc_en = item.desc_en;

    }

    private static _dict = {  };
    public static Get(ID: string) {
        return this._dict[ID];
    }
    public static load():Promise<boolean>{
        return new Promise((resolve, reject) => { 
        resources.load('Json/HAHAH', (err, aset) => {
            if(err){
                console.log(err.message);
                reject(false);
                return;
            };
            let assetobj = aset as JsonAsset;
            let json = assetobj.json;
            json.forEach(item => {
                let cf = new HAHAHConfig(item);
                this._dict[item.ID] = cf;
             });
             resolve(true);
            });
         });
     }
}