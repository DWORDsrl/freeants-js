import { shim } from "promise.prototype.finally";
shim(); //https://stackoverflow.com/questions/35876549/typescript-type-definition-for-promise-prototype-finally
import {AccountDataContext} from "./AccountDataContext";

export class AccountManager {
    
    private static _appName: string = "";    

    private static _accessToken:string = "";
    private static _userId: string = "";
    private static _userName: string = "";
    
    //INFO: apiKey is never persistent
    private static _apiKey = "";

    private static resetLoginData() {
        AccountManager._apiKey = "";

        AccountManager._accessToken = "";
        AccountManager._userId = "";
        AccountManager._userName = "";

        sessionStorage.removeItem(AccountManager._appName + "_Remember");

        localStorage.removeItem(AccountManager._appName + "_AccessToken");
        sessionStorage.removeItem(AccountManager._appName + "_AccessToken");
        localStorage.removeItem(AccountManager._appName + "_UserId");
        sessionStorage.removeItem(AccountManager._appName + "_UserId");
        localStorage.removeItem(AccountManager._appName + "_Username");
        sessionStorage.removeItem(AccountManager._appName + "_Username");
    }
    private static setLoginData(loginData: any, remember: boolean) {
        
        AccountManager._apiKey = "";

        AccountManager._accessToken = loginData.access_token;
        AccountManager._userId = loginData.userId;
        AccountManager._userName = loginData.userName;

        sessionStorage.setItem(AccountManager._appName + "_AccessToken", AccountManager._accessToken);
        sessionStorage.setItem(AccountManager._appName + "_UserId", AccountManager._userId);
        sessionStorage.setItem(AccountManager._appName + "_Username", AccountManager._userName);

        sessionStorage.setItem(AccountManager._appName + "_Remember", remember == true ? "true" : "false");

        if (remember == false)
            return

        localStorage.setItem(AccountManager._appName + "_AccessToken", AccountManager._accessToken);
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

        AccountManager._apiKey = "";

        AccountManager._accessToken = sessionStorage.getItem(AccountManager._appName + "_AccessToken");
        AccountManager._userId = sessionStorage.getItem(AccountManager._appName + "_UserId");
        AccountManager._userName = sessionStorage.getItem(AccountManager._appName + "_Username");

        let remember = localStorage.getItem(AccountManager.appName + "_Remember") == "true" ? true : false;
        if (remember == false)
            return;

        AccountManager._accessToken = localStorage.getItem(AccountManager._appName + "_AccessToken");
        AccountManager._userId = localStorage.getItem(AccountManager._appName + "_UserId");
        AccountManager._userName = localStorage.getItem(AccountManager._appName + "_Username");
    }
    
    public static login(loginData : any, remember: boolean) : Promise<any> {
        return AccountDataContext.login(loginData)
        .then(function(data: any) {
            AccountManager.setLoginData(data, remember);
            return data;
        });
    }
    
    public static async logout() {
        try
        {
            return await AccountDataContext.logout();
        }
        finally {
            AccountManager.resetLoginData();
        }
    }
  
    // No Async version of logout()
    // public static async logout() {
    //     return await AccountDataContext.logout()        
    //     .finally(() => {
    //         AccountManager.resetLoginData();
    //     })
    // }
}