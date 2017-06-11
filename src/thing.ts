import {ThingRaw} from "./thingRaw";
import * as thingConstants from "./thingConstants";

// TODO: Define class userInfo
export class Thing {

    private childrenSkip: number = 0;
    private childrenTotalItems = Number.MAX_SAFE_INTEGER;

    public children : Thing[] = [];

    public id: string = "";
    public creationDateTime: Date;

    public name:string = "";

    public kind: string = "";
    public kindTxt: string;

    public pos: number = 0;

    public deletedStatus: thingConstants.ThingDeletedStatus = thingConstants.ThingDeletedStatus.Ok;

    public deletedDateTime:Date;

    public publicReadClaims: thingConstants.ThingUserReadClaims = thingConstants.ThingUserReadClaims.NoClaims;
    public publicChangeClaims: thingConstants.ThingUserChangeClaims = thingConstants.ThingUserChangeClaims.NoClaims;

    public everyoneReadClaims: thingConstants.ThingUserReadClaims = thingConstants.ThingUserReadClaims.NoClaims;
    public everyoneChangeClaims: thingConstants.ThingUserChangeClaims = thingConstants.ThingUserChangeClaims.NoClaims;

    public userStatus: thingConstants.ThingUserStatus = thingConstants.ThingUserStatus.Ok;
    public userRole: thingConstants.ThingUserRoles = thingConstants.ThingUserRoles.User ;

    public userReadClaims: thingConstants.ThingUserReadClaims = thingConstants.ThingUserReadClaims.NoClaims;
    public userChangeClaims: thingConstants.ThingUserChangeClaims = thingConstants.ThingUserChangeClaims.NoClaims;

    public usersInfos: any[] = [];
    
    public value: any = {}

    constructor(thingRaw : ThingRaw) {
        Object.assign(this, thingRaw);
    }
}