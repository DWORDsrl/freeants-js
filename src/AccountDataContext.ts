import * as qs from "qs"
import axios, { AxiosRequestConfig, AxiosPromise } from "axios";
import {EndPointAddress} from "./EndPointAddress";

export class AccountDataContext {

    private static loginUrl:string = "";
    private static logoutUrl:string = "";
    private static accountUrl:string = "";
    private static userInfoUrl:string = "";
    private static resetPasswordUrl:string = "";
    private static changePasswordUrl:string = "";
    private static confirmAccountByOnlyEmailUrl:string = "";
    private static userloginsUrl:string = "";

    // Must be call before the use of this class
    public static init(endPointAddress: EndPointAddress) {
        AccountDataContext.loginUrl = endPointAddress.server + "token";
        AccountDataContext.accountUrl = endPointAddress.server + "/account";
        AccountDataContext.logoutUrl = AccountDataContext.accountUrl + "/logout";
        AccountDataContext.userInfoUrl = AccountDataContext.accountUrl + "/userInfo";
        AccountDataContext.resetPasswordUrl = AccountDataContext.accountUrl + "/ResetPassword";
        AccountDataContext.changePasswordUrl = AccountDataContext.accountUrl + "/ChangePassword";
        AccountDataContext.confirmAccountByOnlyEmailUrl = AccountDataContext.accountUrl + "/ConfirmAccountByOnlyEmail";
        AccountDataContext.userloginsUrl = AccountDataContext.accountUrl + "/UserLogins";
    }
    
    private static forgotPasswordUrl(email:string, culture:string):string { 
        return AccountDataContext.accountUrl + "/forgotPassword/" + email + "/" + culture;
    }    
    private static registerByOnlyEmailUrl(email:string, culture:string):string { 
        return AccountDataContext.accountUrl + "/RegisterByOnlyEmail/" + email + "/" + culture;
    }

    public static login(data: any) : AxiosPromise {
        return axios.post(AccountDataContext.loginUrl,qs.stringify(data),{
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
    }
}
