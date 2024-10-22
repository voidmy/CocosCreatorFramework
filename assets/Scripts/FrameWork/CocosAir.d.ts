	// /**
	//  * <p> <code>HttpRequest</code> 通过封装 HTML <code>XMLHttpRequest</code> 对象提供了对 HTTP 协议的完全的访问，包括做出 POST 和 HEAD 请求以及普通的 GET 请求的能力。 <code>HttpRequest</code> 只提供以异步的形式返回 Web 服务器的响应，并且能够以文本或者二进制的形式返回内容。</p>
	//  * <p><b>注意：</b>建议每次请求都使用新的 <code>HttpRequest</code> 对象，因为每次调用该对象的send方法时，都会清空之前设置的数据，并重置 HTTP 请求的状态，这会导致之前还未返回响应的请求被重置，从而得不到之前请求的响应结果。</p>
	//  */
	// declare class HttpRequest extends EventDispatcher  {

	// 	/**
	// 	 * @private 
	// 	 */
	// 	protected _http:XMLHttpRequest;

	// 	/**
	// 	 * @private 
	// 	 */
	// 	private static _urlEncode:any;

	// 	/**
	// 	 * @private 
	// 	 */
	// 	protected _responseType:string;

	// 	/**
	// 	 * @private 
	// 	 */
	// 	protected _data:any;

	// 	/**
	// 	 * @private 
	// 	 */
	// 	protected _url:string;

	// 	/**
	// 	 * 发送 HTTP 请求。
	// 	 * @param url 请求的地址。大多数浏览器实施了一个同源安全策略，并且要求这个 URL 与包含脚本的文本具有相同的主机名和端口。
	// 	 * @param data (default = null)发送的数据。
	// 	 * @param method (default = "get")用于请求的 HTTP 方法。值包括 "get"、"post"、"head"。
	// 	 * @param responseType (default = "text")Web 服务器的响应类型，可设置为 "text"、"json"、"xml"、"arraybuffer"。
	// 	 * @param headers (default = null) HTTP 请求的头部信息。参数形如key-value数组：key是头部的名称，不应该包括空白、冒号或换行；value是头部的值，不应该包括换行。比如["Content-Type", "application/json"]。
	// 	 */
	// 	send(url:string,data?:any,method?:string,responseType?:string,headers?:any[]|null):void;

	// 	/**
	// 	 * @private 请求进度的侦听处理函数。
	// 	 * @param e 事件对象。
	// 	 */
	// 	protected _onProgress(e:any):void;

	// 	/**
	// 	 * @private 请求中断的侦听处理函数。
	// 	 * @param e 事件对象。
	// 	 */
	// 	protected _onAbort(e:any):void;

	// 	/**
	// 	 * @private 请求出错侦的听处理函数。
	// 	 * @param e 事件对象。
	// 	 */
	// 	protected _onError(e:any):void;

	// 	/**
	// 	 * @private 请求消息返回的侦听处理函数。
	// 	 * @param e 事件对象。
	// 	 */
	// 	protected _onLoad(e:any):void;

	// 	/**
	// 	 * @private 请求错误的处理函数。
	// 	 * @param message 错误信息。
	// 	 */
	// 	protected error(message:string):void;

	// 	/**
	// 	 * @private 请求成功完成的处理函数。
	// 	 */
	// 	protected complete():void;

	// 	/**
	// 	 * @private 清除当前请求。
	// 	 */
	// 	protected clear():void;

	// 	/**
	// 	 * 请求的地址。
	// 	 */
	// 	get url():string;

	// 	/**
	// 	 * 返回的数据。
	// 	 */
	// 	get data():any;

	// 	/**
	// 	 * 本对象所封装的原生 XMLHttpRequest 引用。
	// 	 */
	// 	get http():any;
	// }

    // declare class EventDispatcher  {

	// 	/**
	// 	 * @private 
	// 	 */
	// 	static MOUSE_EVENTS:any;

	// 	/**
	// 	 * @private 
	// 	 */
	// 	private _events:any;

	// 	/**
	// 	 * 检查 EventDispatcher 对象是否为特定事件类型注册了任何侦听器。
	// 	 * @param type 事件的类型。
	// 	 * @return 如果指定类型的侦听器已注册，则值为 true；否则，值为 false。
	// 	 */
	// 	hasListener(type:string):boolean;

	// 	/**
	// 	 * 派发事件。
	// 	 * @param type 事件类型。
	// 	 * @param data （可选）回调数据。<b>注意：</b>如果是需要传递多个参数 p1,p2,p3,...可以使用数组结构如：[p1,p2,p3,...] ；如果需要回调单个参数 p ，且 p 是一个数组，则需要使用结构如：[p]，其他的单个参数 p ，可以直接传入参数 p。
	// 	 * @return 此事件类型是否有侦听者，如果有侦听者则值为 true，否则值为 false。
	// 	 */
	// 	event(type:string,data?:any):boolean;

	// 	/**
	// 	 * 使用 EventDispatcher 对象注册指定类型的事件侦听器对象，以使侦听器能够接收事件通知。
	// 	 * @param type 事件的类型。
	// 	 * @param caller 事件侦听函数的执行域。
	// 	 * @param listener 事件侦听函数。
	// 	 * @param args （可选）事件侦听函数的回调参数。
	// 	 * @return 此 EventDispatcher 对象。
	// 	 */
	// 	on(type:string,caller:any,listener:Function,args?:any[]):EventDispatcher;

	// 	/**
	// 	 * 使用 EventDispatcher 对象注册指定类型的事件侦听器对象，以使侦听器能够接收事件通知，此侦听事件响应一次后自动移除。
	// 	 * @param type 事件的类型。
	// 	 * @param caller 事件侦听函数的执行域。
	// 	 * @param listener 事件侦听函数。
	// 	 * @param args （可选）事件侦听函数的回调参数。
	// 	 * @return 此 EventDispatcher 对象。
	// 	 */
	// 	once(type:string,caller:any,listener:Function,args?:any[]):EventDispatcher;

	// 	/**
	// 	 * 从 EventDispatcher 对象中删除侦听器。
	// 	 * @param type 事件的类型。
	// 	 * @param caller 事件侦听函数的执行域。
	// 	 * @param listener 事件侦听函数。
	// 	 * @param onceOnly （可选）如果值为 true ,则只移除通过 once 方法添加的侦听器。
	// 	 * @return 此 EventDispatcher 对象。
	// 	 */
	// 	off(type:string,caller:any,listener:Function,onceOnly?:boolean):EventDispatcher;

	// 	/**
	// 	 * 从 EventDispatcher 对象中删除指定事件类型的所有侦听器。
	// 	 * @param type （可选）事件类型，如果值为 null，则移除本对象所有类型的侦听器。
	// 	 * @return 此 EventDispatcher 对象。
	// 	 */
	// 	offAll(type?:string):EventDispatcher;

	// 	/**
	// 	 * 移除caller为target的所有事件监听
	// 	 * @param caller caller对象
	// 	 */
	// 	offAllCaller(caller:any):EventDispatcher;
	// 	private _recoverHandlers:any;

	// 	/**
	// 	 * 检测指定事件类型是否是鼠标事件。
	// 	 * @param type 事件的类型。
	// 	 * @return 如果是鼠标事件，则值为 true;否则，值为 false。
	// 	 */
	// 	isMouseEvent(type:string):boolean;
	// }

    // declare class CCHandler {
    //     /**
    //      * @private CCHandler对象池
    //      */
    //     protected static _pool: CCHandler[];
    
    //     /**
    //      * @private 
    //      */
    //     private static _gid: any;
    
    //     /**
    //      * 执行域(this)。
    //      */
    //     caller: Object | null;
    
    //     /**
    //      * 处理方法。
    //      */
    //     method: Function | null;
    
    //     /**
    //      * 参数。
    //      */
    //     args: any[] | null;
    
    //     /**
    //      * 表示是否只执行一次。如果为true，回调后执行recover()进行回收，回收后会被再利用，默认为false 。
    //      */
    //     once: boolean;
    
    //     /**
    //      * @private 
    //      */
    //     protected _id: number;
    
    //     /**
    //      * 根据指定的属性值，创建一个 <code>Handler</code> 类的实例。
    //      * @param caller 执行域。
    //      * @param method 处理函数。
    //      * @param args 函数参数。
    //      * @param once 是否只执行一次。
    //      */
    
    //     constructor(caller?: Object | null, method?: Function | null, args?: any[] | null, once?: boolean);
    
    //     /**
    //      * 设置此对象的指定属性值。
    //      * @param caller 执行域(this)。
    //      * @param method 回调方法。
    //      * @param args 携带的参数。
    //      * @param once 是否只执行一次，如果为true，执行后执行recover()进行回收。
    //      * @return 返回 handler 本身。
    //      */
    //     setTo(caller: any, method: Function | null, args: any[] | null, once?: boolean): CCHandler;
    
    //     /**
    //      * 执行处理器。
    //      */
    //     run(): any;
    
    //     /**
    //      * 执行处理器，并携带额外数据。
    //      * @param data 附加的回调数据，可以是单数据或者Array(作为多参)。
    //      */
    //     runWith(data: any): any;
    
    //     /**
    //      * 清理对象引用。
    //      */
    //     clear(): CCHandler;
    
    //     /**
    //      * 清理并回收到 Handler 对象池内。
    //      */
    //     recover(): void;
    
    //     /**
    //      * 从对象池内创建一个Handler，默认会执行一次并立即回收，如果不需要自动回收，设置once参数为false。
    //      * @param caller 执行域(this)。
    //      * @param method 回调方法。
    //      * @param args 携带的参数。
    //      * @param once 是否只执行一次，如果为true，回调后执行recover()进行回收，默认为true。
    //      * @return 返回创建的handler实例。
    //      */
    //     static create(caller: any, method: Function | null, args?: any[] | null, once?: boolean): CCHandler;
    // }

    // declare module Pitaya{
    //     class Event  {

    //         static COMPLETE:string;
    //         static ERROR:string;
    //     }
    // }


