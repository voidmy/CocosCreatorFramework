import { HAHAHConfig } from "./HAHAHConfig";
import { TestConfig } from "./TestConfig";


export class ConfigMgr {

    /**
     * 当前加载完成了 多少个配置
     */
    public static nowHasLoadNum: number = 0;
    /**
     * 总共需要加载的 配置表 数量 
     */
    public static readonly cfAllNum: number = 2;

    private static isLoadAll:boolean=false;

    public static LoadAllConfig() {
        this.isLoadAll =false;
        let promises = [];

        promises.push(TestConfig.load());
        promises.push(HAHAHConfig.load());
        Promise.all(promises)
            .then((values) => {
                // 所有资源加载完成
                this.isLoadAll =true;
                console.log("所有配置表资源加载完成");
                //console.log(values); // values 是对应 promise 原本 resolve 的数据组成的数组
            })
            .catch((error) => {
                // 发生错误，可能是任何一个资源加载出错
                console.error(error);
            });
    }

    private static loadOneComplete(isComplete: boolean) {

    }
    /**
     * 
     * @returns 得到是否加载完成
     */
    public static GetHasLoadComplete(): boolean {
       return this.isLoadAll
    }
}