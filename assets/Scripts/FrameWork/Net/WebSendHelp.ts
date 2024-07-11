import { CCHandler } from "../Core/CCHandler";
import WebAPI from "./WebAPI";
import { StartGameMsg } from "./WebMsg";
import WebRequestManager from "./WebRequestManager";

export class WebSendHelp {

    /**成功 code */
    public static SuccessCode = 10000;

    public static SendStartGem(userId: number, authToken: string, callSuccess?: CCHandler, callFail?: CCHandler): void {
        let arg = {
            "userId": userId,
            "authToken": authToken
        };
        WebRequestManager.Post(WebAPI.GetFullHost(WebAPI.API_START_GAME), arg, CCHandler.create(this, (response) => {
            if (response.code == this.SuccessCode) {
                let msg: StartGameMsg = response as StartGameMsg;
                if (callSuccess != null) {
                    callSuccess.runWith(msg);
                }
            } else {
                if (callFail != null) {
                    callFail.runWith(response);
                }
            }

        }));
    }
}