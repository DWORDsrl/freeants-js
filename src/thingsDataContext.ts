import axios, { AxiosRequestConfig, AxiosPromise, CancelToken } from "axios";
import {ItemsRange, Helpers} from "./helpers";
import {EndPointAddress} from "./endPointAddress";

export interface ThingsData {
    things:  any[];
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
    private static thingChildrenUrl(parentThingId: string, childrenId: string) {
        return ThingsDataContext.apiEndPointAddress + "/things/" + (parentThingId) + "/childrenIds/" + (childrenId || "");
    }
    private static thingDeleteChild(parentThingId: string, childThingId: string) {
        return ThingsDataContext.apiEndPointAddress + "/things/" + parentThingId + "/childrenIds/" + childThingId 
    }

    // INFO: Is mandatory call before the use of this class
    public static init(endPointAddress: EndPointAddress) {

        ThingsDataContext.apiEndPointAddress = endPointAddress.api;
    }

    public static getThings(parameter: any, cancelToken?: CancelToken) : Promise<any> {
            var urlRaw = ThingsDataContext.thingsUrl() + "?" +
                    (!!parameter.parentThingId ? ("&$parentId=" + parameter.parentThingId) : "") +
                    (!!parameter.filter ? ("&$filter=" + parameter.filter) : "") +
                    (!!parameter.top ? ("&$top=" + parameter.top) : "") +
                    (!!parameter.skip ? ("&$skip=" + parameter.skip) : "") +
                    (parameter.deleteStatus == null || parameter.deleteStatus == undefined ? "" : 
                        "&$deletedStatus=" + parameter.deleteStatus) +
                    (!!parameter.orderBy ? ("&$orderby=" + parameter.orderBy) : "") +
                    (!!parameter.valueFilter ? ("&$valueFilter=" + parameter.valueFilter) : "");

            return axios.get(urlRaw, {
                headers: Helpers.securityHeaders,
                cancelToken: cancelToken
            })
            .then(function (response: any) : ThingsData {
                return {
                    things: response.data,
                    itemsRange: Helpers.getRangeItemsFromResponse(response)
                };
            });
        }
}