export {}

declare global{

    const __g: any;
    const _nonEnumerable: { enumerable?: boolean };
    const _emptyString: string;
    type Nullable<T> = T | null | undefined;
    type nstring = Nullable<string>;
    interface Date
    {
        /**
         *  Return YYYY-MM-DD format
         * @param split Splitor default -
         */
        yyyymmdd(split?: string): string;
    }
    interface String{
        isNullOrEmpty(): boolean;
    }
    function _isString(o: any): o is string;
    function _isNullOrEmpty(s: nstring): s is null | undefined | '';
}
let g = typeof window === 'undefined' ? typeof globalThis === 'undefined' ? undefined : globalThis : window;
if (!g)
{
    eval(`g = typeof global === 'undefined' ? undefined : global`);
    if (!g) throw 'Failed to initialize global environment, global, globalThis and window is undefined.';
}
(g as any).__g = g;

const _g = g;
export default _g;

__g._emptyString     = "";
__g._nonEnumerable = { enumerable: false };
//Object.defineProperty(Array.prototype, 'clear', _nonEnumerable);
_g._isString = function(o: any): o is string
{
    return typeof o === 'string';
}
_g._isNullOrEmpty = function(s: nstring): s is null | undefined | ''
{
    return s?.isNullOrEmpty() ?? true;
}

Date.prototype.yyyymmdd = function(split?: string): string
{
    split = split ?? '-'; 

    let year = this.getFullYear();
    let month = this.getMonth() + 1;
    let day = this.getDate();

    return `${year}${split}${month < 10 ? '0' + month : month}${split}${day < 10 ? '0' + day : day}`;
}
String.prototype.isNullOrEmpty = function()
{
    return this === _emptyString || this == null || this == undefined;
}

Object.defineProperty(Date.prototype, 'yyyymmdd', _nonEnumerable);
Object.defineProperty(String.prototype, 'isNullOrEmpty', _nonEnumerable);