import axios, { AxiosRequestConfig, AxiosPromise, CancelToken } from "axios";
import {ItemsRange, Helpers} from "./helpers";
import {EndPointAddress} from "./endPointAddress";

export interface UsersGetParams {
    filter : string;
    top : number;
    skip : number
    orderBy : string
}

export interface UsersRawDataSet {
    users:  any[];
    itemsRange: ItemsRange
}

export class UsersDataContext {
    private static apiEndPointAddress : string = "";

    private static usersUrl(userId? : string ) { 
        return UsersDataContext.apiEndPointAddress + "/users/" + (userId || ""); 
    }

    // INFO: Is mandatory call "init"" before the use of this class
    public static init(endPointAddress: EndPointAddress) {

        UsersDataContext.apiEndPointAddress = endPointAddress.api;
    }

    public static getUser(userId : string) : Promise<any> {
        return axios.get(UsersDataContext.usersUrl(userId), {
            headers: Helpers.securityHeaders
        })
        .then(function(response: any) : any {
            return response.data;
        });
    }
    public static getUsers(parameter : UsersGetParams, canceler?: any) : Promise<UsersRawDataSet> {
            let urlRaw : string = UsersDataContext.usersUrl() + "?" +
                    (!!parameter.filter ? ("&$filter=" + parameter.filter) : "") +
                    (!!parameter.top ? ("&$top=" + parameter.top) : "") +
                    (!!parameter.skip ? ("&$skip=" + parameter.skip) : "") +
                    (!!parameter.orderBy ? ("&$orderby=" + parameter.orderBy) : "");

        var CancelToken = axios.CancelToken;
        
        return axios.get(urlRaw, {
                headers: Helpers.securityHeaders,
                cancelToken: canceler != undefined ? new CancelToken(function executor(c) {
                    canceler = c;
                }) : null
            })
        .then(function(response: any) : UsersRawDataSet {
            return {
                users: response.data,
                itemsRange: Helpers.getRangeItemsFromResponse(response)
            };
        });
    }
    public static createUser(userRaw: any) : Promise<any> {
        return axios.post(UsersDataContext.usersUrl(), userRaw, {
            headers: Helpers.securityHeaders
        })
        .then(function(response: any) : any {            
            return response.data as any;
        })
    }
    // TOCHECK: Check Returned data
    public static updateUser(userId: string, thingRaw: any) : Promise<any> {
        return axios.put(UsersDataContext.usersUrl(userId), thingRaw, {
            headers: Helpers.securityHeaders
        })
        .then(function(response: any) : any {            
            return response.data;
        });
    }
    // TOCHECK: Check Returned data
    public static deleteThing(userId: string) : Promise<any> {
        return axios.delete(UsersDataContext.usersUrl(userId), {
            headers: Helpers.securityHeaders
        })
        .then(function(response: any) : any {            
            return response.data;
        })
    }
}