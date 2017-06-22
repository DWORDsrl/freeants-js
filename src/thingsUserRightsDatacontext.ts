import axios, { AxiosRequestConfig, AxiosPromise, CancelToken } from "axios";
import {Helpers} from "./helpers";
import {EndPointAddress} from "./endPointAddress";
import {ThingUserRightsRaw} from "./thingUserRights";

export interface ThingsUserRightsParams {
    thingId : string;
    filter? : string;
    top? : number;
    skip? : number;
    orderBy? : string;
}

export class ThingsUserRightsDataContext {

    private static apiEndPointAddress: string = "";

    private static thingsUserRoleStatusUrl(thingId : string, userId? : string) : string {
        return ThingsUserRightsDataContext.apiEndPointAddress + "/things/" + thingId + "/usersrights" + (userId != undefined ? ("/" + userId) : "");
    }

    public static init(endPointAddress: EndPointAddress) {

        ThingsUserRightsDataContext.apiEndPointAddress = endPointAddress.api;
    }

    public static getThingUsersRights(parameter : ThingsUserRightsParams) : Promise<ThingUserRightsRaw[]> {

        let url : string = ThingsUserRightsDataContext.thingsUserRoleStatusUrl(parameter.thingId) + "?" +
                    (!!parameter.filter ? ("&$filter=" + parameter.filter) : "") +
                    (!!parameter.top ? ("&$top=" + parameter.top) : "") +
                    (!!parameter.skip ? ("&$skip=" + parameter.skip) : "") +
                    (!!parameter.orderBy ? ("&$orderby=" + parameter.orderBy) : "");

        return axios.get(url, {
            headers: Helpers.securityHeaders
        })
        .then(function(response: any) : ThingUserRightsRaw[] {
            return response.data;
        })
    }
    public static createThingUserRights(thingId : string, thingUserRights : ThingUserRightsRaw) : Promise<ThingUserRightsRaw> {

        return axios.post(ThingsUserRightsDataContext.thingsUserRoleStatusUrl(thingId), thingUserRights, {
            headers: Helpers.securityHeaders
        })
        .then(function(response: any) : ThingUserRightsRaw {            
            return response.data as ThingUserRightsRaw;
        })
    }  
    public static updateThingUserRights(thingId : string, userId : string, thingUserRights : ThingUserRightsRaw) : Promise<ThingUserRightsRaw> {
        return axios.put(ThingsUserRightsDataContext.thingsUserRoleStatusUrl(thingId, userId), thingUserRights, {
            headers: Helpers.securityHeaders
        })
        .then(function(response: any) : ThingUserRightsRaw {            
            return response.data;
        });
    }
    public static deleteThingUserRights(thingId : string, userId : string) : Promise<any> {
        return axios.delete(ThingsUserRightsDataContext.thingsUserRoleStatusUrl(thingId, userId), {
            headers: Helpers.securityHeaders
        })
        .then(function(response: any) : any {            
            return response.data;
        })
    }
}