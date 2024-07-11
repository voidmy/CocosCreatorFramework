export default class WebAPI
{
    static readonly API_TEST="";
    static readonly API_TESTAAA="AAA";
    static readonly API_START_GAME="game/startGame";
    static customHost: string = "";
    public static GetFullHost(api: string)
    {
        //if (!_isNullOrWhiteSpace(this.customHost))
           // return `${this.customHost}${api}`;
        if (__DEBUG)
            return `${this.DEBUG_HOST_SERVER}${api}`;
        return `${this.HOST_SERVER}${api}`;
    }


    public static readonly HOST_SERVER="http://10.10.106.66:9001/";
    public static readonly DEBUG_HOST_SERVER="http://10.10.106.66:9001/";
}