import * as qs from "qs"
import axios, { AxiosRequestConfig, AxiosPromise } from "axios";
import {HttpFailResult, Helpers} from "./helpers";
import {EndPointAddress} from "./endPointAddress";

export interface LoginData {
        grant_type : string;
        username : string;
        password : string;
}

export class AccountDataContext {

    private static loginUrl:string = "";
    private static logoutUrl:string = "";
    private static accountUrl:string = "";
    private static userInfoUrl:string = "";
    private static resetPasswordUrl:string = "";
    private static changePasswordUrl:string = "";
    private static confirmAccountByOnlyEmailUrl:string = "";
    private static userloginsUrl:string = "";

    private static registerByOnlyEmailUrl(email:string, culture:string):string { 
        return AccountDataContext.accountUrl + "/RegisterByOnlyEmail/" + email + "/" + culture;
    }  
    private static forgotPasswordUrl(email:string, culture:string):string { 
        return AccountDataContext.accountUrl + "/forgotPassword/" + email + "/" + culture;
    } 

    // INFO: Is mandatory call before the use of this class
    public static init(endPointAddress: EndPointAddress) : void {
        AccountDataContext.loginUrl = endPointAddress.server + "/token";
        AccountDataContext.accountUrl = endPointAddress.api + "/account";
        AccountDataContext.logoutUrl = AccountDataContext.accountUrl + "/logout";
        AccountDataContext.userInfoUrl = AccountDataContext.accountUrl + "/userInfo";
        AccountDataContext.resetPasswordUrl = AccountDataContext.accountUrl + "/ResetPassword";
        AccountDataContext.changePasswordUrl = AccountDataContext.accountUrl + "/ChangePassword";
        AccountDataContext.confirmAccountByOnlyEmailUrl = AccountDataContext.accountUrl + "/ConfirmAccountByOnlyEmail";
        AccountDataContext.userloginsUrl = AccountDataContext.accountUrl + "/UserLogins";
    }

    public static login(loginData: LoginData) : Promise<any | HttpFailResult> {
        return axios.post(AccountDataContext.loginUrl,qs.stringify(loginData), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
        .then(function(response) : any {
            return response.data;
        });
    }
    public static logout() : Promise<any | HttpFailResult> {
        return axios.post(AccountDataContext.logoutUrl, null, {
            headers: Helpers.securityHeaders
        })
        .then(function(response: any) : any {
            return response.data;
        });
    }
    
    public static getUserInfo() : Promise<any | HttpFailResult> {
        return axios.get(AccountDataContext.userInfoUrl, {
            headers: Helpers.securityHeaders
        })
        .then(function(response: any): any {
            return response.data;
        });
    }
}
