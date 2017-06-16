import { shim } from "promise.prototype.finally";
shim(); //https://stackoverflow.com/questions/35876549/typescript-type-definition-for-promise-prototype-finally
import {AccountDataContext} from "./accountDataContext";

export class AccountManager {
    
    private static _appName: string = null;    

    private static _accessToken:string = null;
    private static _accessTokenDate: string = null;

    private static _userId: string = null;
    private static _userName: string = null;
    
    //INFO: apiKey is never persistent
    private static _apiKey : string = null;

    private static resetLoginData() : void {
        AccountManager._apiKey = null;

        AccountManager._accessToken = null;
        AccountManager._accessTokenDate = null;

        AccountManager._userId = null;
        AccountManager._userName = null;

        localStorage.removeItem(AccountManager._appName + "_Remember");

        localStorage.removeItem(AccountManager._appName + "_AccessToken");
        sessionStorage.removeItem(AccountManager._appName + "_AccessToken");        
        localStorage.removeItem(AccountManager._appName + "_AccessTokenDate");
        sessionStorage.removeItem(AccountManager._appName + "_AccessTokenDate");

        localStorage.removeItem(AccountManager._appName + "_UserId");
        sessionStorage.removeItem(AccountManager._appName + "_UserId");
        localStorage.removeItem(AccountManager._appName + "_Username");
        sessionStorage.removeItem(AccountManager._appName + "_Username");
    }
    private static setLoginData(loginData: any, remember: boolean) : void {
        
        AccountManager._apiKey = null;

        AccountManager._accessToken = loginData.access_token;
        AccountManager._accessTokenDate = loginData[".expires"];

        AccountManager._userId = loginData.userId;
        AccountManager._userName = loginData.userName;

        sessionStorage.setItem(AccountManager._appName + "_AccessToken", AccountManager._accessToken);
        sessionStorage.setItem(AccountManager._appName + "_AccessTokenDate", AccountManager._accessTokenDate);

        sessionStorage.setItem(AccountManager._appName + "_UserId", AccountManager._userId);
        sessionStorage.setItem(AccountManager._appName + "_Username", AccountManager._userName);

        localStorage.setItem(AccountManager._appName + "_Remember", remember == true ? "true" : "false");

        if (remember == false)
            return

        localStorage.setItem(AccountManager._appName + "_AccessToken", AccountManager._accessToken);
        localStorage.setItem(AccountManager._appName + "_AccessTokenDate", AccountManager._accessTokenDate);

        localStorage.setItem(AccountManager._appName + "_UserId", AccountManager._userId);
        localStorage.setItem(AccountManager._appName + "_Username", AccountManager._userName);
    }
    
    public static set appName(value: string) {
        AccountManager._appName = value;
    }

    public static set apiKey(value: string) {

        // I do not know if I used the loginData before, so I reset LoginData
        AccountManager.resetLoginData();

        AccountManager._apiKey = value;
    }

    public static get accessToken() : string {
        return AccountManager._accessToken;
    }

    public static get apiKey() : string {
        return AccountManager._apiKey;
    }

    public static readLoginData() {

        // INFO: By design ApiKey is never persistent
        AccountManager._apiKey = null;

        AccountManager._accessToken = sessionStorage.getItem(AccountManager._appName + "_AccessToken");
        AccountManager._accessTokenDate = sessionStorage.getItem(AccountManager._appName + "_AccessTokenDate");

        AccountManager._userId = sessionStorage.getItem(AccountManager._appName + "_UserId");
        AccountManager._userName = sessionStorage.getItem(AccountManager._appName + "_Username");

        let remember = localStorage.getItem(AccountManager._appName + "_Remember") == "true" ? true : false;
        if (remember == false)
            return;

        AccountManager._accessToken = localStorage.getItem(AccountManager._appName + "_AccessToken");
        AccountManager._accessTokenDate = localStorage.getItem(AccountManager._appName + "_AccessTokenDate");

        AccountManager._userId = localStorage.getItem(AccountManager._appName + "_UserId");
        AccountManager._userName = localStorage.getItem(AccountManager._appName + "_Username");
    }

    public static checkAccessToken() : boolean {
        if (AccountManager._accessToken != null) {
            let now : Date = new Date();
            let now_utc : Date = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
            if (Date.parse(AccountManager._accessTokenDate) <= now_utc.getTime()) {
                AccountManager.resetLoginData();
                return false;
            }
            return true;
        }
        return false;
    }
    
    public static login(loginData : any, remember: boolean) : Promise<any> {
        return AccountDataContext.login(loginData)
        .then(function(response: any) {
            AccountManager.setLoginData(response, remember);
            return response;
        });
    }  
    public static async logout() : Promise<any> {
        try
        {
            return await AccountDataContext.logout();
        }
        finally {
            AccountManager.resetLoginData();
        }
    }

    public static async getLoggedInUserInfo() : Promise<any> {
        return await AccountDataContext.getUserInfo();
    }    
}
