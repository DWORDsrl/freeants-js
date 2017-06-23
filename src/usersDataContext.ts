import { shim } from "promise.prototype.finally";
shim(); //https://stackoverflow.com/questions/35876549/typescript-type-definition-for-promise-prototype-finally

import axios, { AxiosRequestConfig, AxiosPromise, CancelToken } from "axios";
import { HttpFailResult, HttpRequestCanceler, ItemsRange, Helpers} from "./helpers";
import {EndPointAddress} from "./endPointAddress";
import {UserInfoRaw} from "./userInfo"

export interface UsersGetParams {
    filter? : string;
    top? : number;
    skip? : number
    orderBy? : string
}

export interface UsersRawDataSet {
    users:  UserInfoRaw[];
    itemsRange: ItemsRange
}

export class UsersDataContext {
    private static apiEndPointAddress : string = "";

    private static usersUrl(userId? : string) { 
        return UsersDataContext.apiEndPointAddress + "/users/" + (userId || ""); 
    }

    // INFO: Is mandatory call "init"" before the use of this class
    public static init(endPointAddress: EndPointAddress) {

        UsersDataContext.apiEndPointAddress = endPointAddress.api;
    }

    public static getUser(userId : string) : Promise<any | HttpFailResult> {
        return axios.get(UsersDataContext.usersUrl(userId), {
            headers: Helpers.securityHeaders
        })
        .then(function(response: any) : UserInfoRaw {
            return response.data;
        });
    }
    public static getUsers(parameter : UsersGetParams, canceler? : HttpRequestCanceler) : Promise<any | HttpFailResult> {
        
        let urlRaw : string = UsersDataContext.usersUrl() + "?" +
                (!!parameter.filter ? ("&$filter=" + parameter.filter) : "") +
                (!!parameter.top ? ("&$top=" + parameter.top) : "") +
                (!!parameter.skip ? ("&$skip=" + parameter.skip) : "") +
                (!!parameter.orderBy ? ("&$orderby=" + parameter.orderBy) : "");
        
        if (canceler != undefined) {            
            if (canceler.cancelerToken == null) {
                var CancelToken = axios.CancelToken;
                canceler.cancelerToken = new CancelToken(function executor(c) {
                    canceler.executor = c;
                });
            }
        }
        
        return axios.get(urlRaw, {
                headers: Helpers.securityHeaders,
                cancelToken: (canceler != undefined) ? canceler.cancelerToken : null
            })
            .then(function(response: any) : UsersRawDataSet {
                return {
                    users: response.data,
                    itemsRange: Helpers.getRangeItemsFromResponse(response)
                };
            })
            .finally(function() {
                if (canceler != undefined)
                    canceler.reset();
            });
    }
    public static createUser(userRaw: UserInfoRaw) : Promise<any | HttpFailResult> {
        return axios.post(UsersDataContext.usersUrl(), userRaw, {
            headers: Helpers.securityHeaders
        })
        .then(function(response: any) : UserInfoRaw {            
            return response.data as UserInfoRaw;
        })
    }
    // TOCHECK: Check Returned data
    public static updateUser(userId: string, userRaw: UserInfoRaw) : Promise<any | HttpFailResult> {
        return axios.put(UsersDataContext.usersUrl(userId), userRaw, {
            headers: Helpers.securityHeaders
        })
        .then(function(response: any) : UserInfoRaw {            
            return response.data;
        });
    }
    // TOCHECK: Check Returned data
    public static deleteUser(userId: string) : Promise<any | HttpFailResult> {
        return axios.delete(UsersDataContext.usersUrl(userId), {
            headers: Helpers.securityHeaders
        })
        .then(function(response: any) : any {            
            return response.data;
        })
    }
}