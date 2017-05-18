import * as $ from "jquery";

export class AccountManager {
    
    private static _appName: string = "";

    private static _accessToken:string = "";
    private static _dwApiKey = "";//INFO: DWApiKey is never persistent

    public static set appName(value: string) {
        AccountManager._appName = value;
    }
    public static get appName() {
        return AccountManager._appName;
    }

    public static set dwApiKey(value: string) {
        AccountManager._dwApiKey = value;
    }
    public static get dwApiKey() {
        return AccountManager._dwApiKey;
    }

    public static readLoginData() {
        AccountManager.dwApiKey = "";

        AccountManager._accessToken = sessionStorage.getItem(AccountManager.appName + "_AccessToken");
    }
}