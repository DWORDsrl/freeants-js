import axios, { AxiosRequestConfig, AxiosPromise, CancelToken } from "axios";
import {ItemsRange, Helpers} from "./helpers";
import {EndPointAddress} from "./endPointAddress";
import {ThingRaw} from "./thingRaw";
import * as thingConstants from "./thingConstants";

export interface ThingsGetParams {
    parentThingId? : string;
    filter? : string;
    top? : number;
    skip? : number;
    deleteStatus? : thingConstants.ThingDeletedStatus;
    orderBy? : string;
    valueFilter? : string
}

export interface ThingsRawDataSet {
    things:  ThingRaw[];
    itemsRange: ItemsRange
}

export class ThingsDataContext {

    private static apiEndPointAddress: string = "";
    
    private static thingsUrl(thingId?: string) : string { 
        return ThingsDataContext.apiEndPointAddress + "/things/" + (thingId || ""); 
    }
    private static thingsValueUrl(thingId: string) : string { 
        return ThingsDataContext.apiEndPointAddress + "/things/" + thingId + "/value" 
    }
    private static thingsPositionUrl() : string {
        return ThingsDataContext.apiEndPointAddress + "/things/position" 
    }
    private static thingsPositionsUrl() : string {
        return ThingsDataContext.apiEndPointAddress + "/things/positions" 
    }
    private static thingChildrenUrl(parentThingId: string, childrenId?: string) {
        return ThingsDataContext.apiEndPointAddress + "/things/" + (parentThingId) + "/childrenIds/" + (childrenId || "");
    }
    private static thingDeleteChildUrl(parentThingId: string, childThingId: string) {
        return ThingsDataContext.apiEndPointAddress + "/things/" + parentThingId + "/childrenIds/" + childThingId 
    }

    // INFO: Is mandatory call "init"" before the use of this class
    public static init(endPointAddress: EndPointAddress) {

        ThingsDataContext.apiEndPointAddress = endPointAddress.api;
    }

    // INFO: To abort call "canceler()"
    public static getThings(parameter: ThingsGetParams, canceler?: any) : Promise<ThingsRawDataSet> {
        var urlRaw = ThingsDataContext.thingsUrl() + "?" +
                (!!parameter.parentThingId ? ("&$parentId=" + parameter.parentThingId) : "") +
                (!!parameter.filter ? ("&$filter=" + parameter.filter) : "") +
                (!!parameter.top ? ("&$top=" + parameter.top) : "") +
                (!!parameter.skip ? ("&$skip=" + parameter.skip) : "") +
                (parameter.deleteStatus == null || parameter.deleteStatus == undefined ? "" : 
                    "&$deletedStatus=" + parameter.deleteStatus) +
                (!!parameter.orderBy ? ("&$orderby=" + parameter.orderBy) : "") +
                (!!parameter.valueFilter ? ("&$valueFilter=" + parameter.valueFilter) : "");

        var CancelToken = axios.CancelToken;
        
        return axios.get(urlRaw, {
                headers: Helpers.securityHeaders,
                cancelToken: canceler != undefined ? new CancelToken(function executor(c) {
                    canceler = c;
                }) : null
            })
        .then(function(response: any) : ThingsRawDataSet {
            return {
                things: response.data,
                itemsRange: Helpers.getRangeItemsFromResponse(response)
            };
        });
    }
    public static getThing(thingId: string) : Promise<ThingRaw> {
        return axios.get(ThingsDataContext.thingsUrl(thingId), {
            headers: Helpers.securityHeaders
        })
        .then(function(response: any) : ThingRaw {
            return response.data;
        })
    }
    // TOCHECK: Check Returned data
    public static createThing(thingRaw: ThingRaw) : Promise<any> {
        return axios.post(ThingsDataContext.thingsUrl(), thingRaw, {
            headers: Helpers.securityHeaders
        })
        .then(function(response: any) : ThingRaw {            
            return response.data as ThingRaw;
        })
    }
    // TOCHECK: Check Returned data
    public static updateThing(thingId: string, thingRaw: ThingRaw) : Promise<any> {
        return axios.put(ThingsDataContext.thingsUrl(thingId), thingRaw, {
            headers: Helpers.securityHeaders
        })
        .then(function(response: any) : any {            
            return response.data;
        });
    }
    // TOCHECK: Check Returned data
    public static deleteThing(thingId: string) : Promise<any> {
        return axios.delete(ThingsDataContext.thingsUrl(thingId), {
            headers: Helpers.securityHeaders
        })
        .then(function(response: any) : any {            
            return response.data;
        })
    }

    // TOCHECK: Check Returned data
    public static getThingChildrenIds(parentThingId: string) : Promise<any> {
        return axios.get(ThingsDataContext.thingChildrenUrl(parentThingId), {
            headers: Helpers.securityHeaders
        })
        .then(function(response: any) : any {
            return response.data;
        })
    }

    // TOCHECK: Check Returned data
    public static addChildToParent(parentThingId: string, childThingId: string) : Promise<any> {
        return axios.post(ThingsDataContext.thingChildrenUrl(parentThingId), JSON.stringify(childThingId), {
            headers: Helpers.securityHeaders
        })
        .then(function(response: any) : any {
            
            return response.data;
        })
    }
    // TOCHECK: Check Returned data
    public static deleteThingChild(parentThingId: string, childThingId: string) : Promise<any> {
        return axios.delete(ThingsDataContext.thingDeleteChildUrl(parentThingId, childThingId), {
            headers: Helpers.securityHeaders
        })
        .then(function(response: any) : any {
            return response.data;
        })
    }

    public static getThingValue(thingId: string, value: any) : Promise<any> {
        return axios.get(ThingsDataContext.thingsValueUrl(thingId), {
            headers: Helpers.securityHeaders
        })
        .then(function(response: any) : any {
            return response.data;
        })
    }
    public static putThingValue(thingId:string, value:any): Promise<any> {
        return axios.put(ThingsDataContext.thingsValueUrl(thingId), value, {
            headers: Helpers.securityHeaders
        })
        .then(function(response: any) : any {            
            return response.data;
        })
    }

    // TOCHECK: Check Returned data
    public static putThingPosition(parentThingId: string, childThingId: string, position: number):Promise<any> {
        return axios.put(ThingsDataContext.thingsPositionUrl(), 
            JSON.stringify({
                "parentId": parentThingId, 
                "childId": childThingId, 
                "pos": position }), 
            {
                headers: Helpers.securityHeaders
            })
        .then(function(response: any) : any {            
            return response.data;
        })            
    }

    // TOCHECK: Check Returned data
    public static putThingsPositions(positions: number[]):Promise<any> {
        return axios.put(ThingsDataContext.thingsPositionUrl(), 
            positions, 
            {
                headers: Helpers.securityHeaders
            })
        .then(function(response: any) : any {            
            return response.data;
        })
    }
}