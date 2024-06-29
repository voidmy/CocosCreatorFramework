let _m: any;
export default abstract class Module implements IMessager
{
    private static _Initialize() { _m.Initialize(); }

    listeners: { receiver: any; handler: Function; }[] = [];
    sending: number = 0;
    public send(message: string, ...args: any[])
    {
        MessageCenter.send(this, message, ...args);
    }
    public readonly name: string;
    public readonly identifier: string;
    public get priority() { return 0; }
    private m_enableUpdate = false;
    public get enableUpdate() { return this.m_enableUpdate; }
    public set enableUpdate(value: boolean)
    {
        value = value && (this.Update !== Module.prototype.Update);
        if (this.m_enableUpdate == value) return;
        this.m_enableUpdate = value;
        _m.RegisterUpdate(this);
    }

    constructor(name: string, identifier: string) { this.name = name; this.identifier = identifier; this.m_enableUpdate = this.Update !== Module.prototype.Update; _m.Register(this); }

    public Update() {}
    
    /** Called after all modules create */
    protected Initialize() {}
    /** 初始化模块数据 */
    public OnGetArchive() {}
    /** 模块数据初始化后调用 */
    public Run() {}
}
	//#region Message center
	/** 消息派发者 */
interface IMessager
{
    listeners: { receiver: any, handler: Function }[];
    sending: number;
}

	/** 消息中心 */
declare class MessageCenter
{
    private static m_senders: IMessager[];

    private static validSender(sender: IMessager): { receiver: any, handler: Function }[];

    public static register(sender: IMessager, receiver: any, handler: Function): void;
    public static register(sender: IMessager, receiver: any, handler: string): void;
    public static register(sender: IMessager, receiver: any, handler: string | Function): void;

    public static send(sender: IMessager, message: string, ...args: any[]): void;

    public static remove(receiver: any): void;
}
export class ModuleManager
{
    /** Get a copy of current module list */
    public get modules() { return new Array<Module>(...this.m_modules); }

    public tag :string="7852555";
    private m_modules: Module[] = [];
    private m_updates: Module[] = [];

    private m_i: number = 0;
    private m_c: number = 0;
    
    private Register(m: Module)
    {
        this.m_modules.push(m);
        this.RegisterUpdate(m);
    }

    private RegisterUpdate(m: Module)
    {
        let i = this.m_updates.indexOf(m);
        if (i < 0)
        {
            if (!m.enableUpdate) return;
            this.m_c += 1;
            this.m_updates.push(m);
        }
        else
        {
            if (m.enableUpdate) return;
            this.m_c -= 1;
            this.m_updates.splice(i, 1);

            if (i <= this.m_i) this.m_i -= 1;
        }
    }

    private Initialize()
    {
     
        for (const module of this.m_modules) (module as any).Initialize();

        console.log('ModuleManager: [%s] Module Initialized!', this.m_modules.length);
    }

    /** Update all modules */
    public Update()
    {
        for (this.m_i = 0, this.m_c = this.m_updates.length; this.m_i < this.m_c; ++this.m_i)
        {
            let m = this.m_updates[this.m_i];
            m.Update();
        }
    }

    public Foreach(action: (m: Module) => boolean | void)
    {
        for (const module  of this.m_modules)
            if (action(module)) break;
    }
}
declare global
{
    /** Module manager */
    const __manager: ModuleManager;
}

//_m = new ModuleManager();
//__g.__manager = _m;