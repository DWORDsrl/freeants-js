import {UserInfo} from "./userInfo";
import * as thingConstants from "./thingConstants";

export interface ThingRaw {

    id: string
    creationDateTime: Date

    name:string

    kind: string
    kindTxt: string

    pos: number

    deletedStatus : thingConstants.ThingDeletedStatus

    publicReadClaims : thingConstants.ThingUserReadClaims
    publicChangeClaims : thingConstants.ThingUserChangeClaims

    everyoneReadClaims : thingConstants.ThingUserReadClaims
    everyoneChangeClaims : thingConstants.ThingUserChangeClaims

    userStatus : thingConstants.ThingUserStatus
    userRole : thingConstants.ThingUserRoles

    userReadClaims: thingConstants.ThingUserReadClaims
    userChangeClaims: thingConstants.ThingUserChangeClaims

    value : string

    usersInfos : UserInfo[]

}

export class Thing /*implements ThingRaw*/ {

    public childrenSkip: number = 0
    public childrenTotalItems = Number.MAX_SAFE_INTEGER

    public children : Thing[] = []

    public id: string = ""
    public creationDateTime: Date

    public name:string = ""

    public kind: string = ""
    public kindTxt: string

    public pos: number = 0

    public deletedStatus : thingConstants.ThingDeletedStatus = thingConstants.ThingDeletedStatus.Ok

    public deletedDateTime : Date

    public publicReadClaims : thingConstants.ThingUserReadClaims = thingConstants.ThingUserReadClaims.NoClaims
    public publicChangeClaims : thingConstants.ThingUserChangeClaims = thingConstants.ThingUserChangeClaims.NoClaims

    public everyoneReadClaims : thingConstants.ThingUserReadClaims = thingConstants.ThingUserReadClaims.NoClaims
    public everyoneChangeClaims : thingConstants.ThingUserChangeClaims = thingConstants.ThingUserChangeClaims.NoClaims

    public userStatus : thingConstants.ThingUserStatus = thingConstants.ThingUserStatus.Ok
    public userRole : thingConstants.ThingUserRoles = thingConstants.ThingUserRoles.User

    public userReadClaims: thingConstants.ThingUserReadClaims = thingConstants.ThingUserReadClaims.NoClaims
    public userChangeClaims: thingConstants.ThingUserChangeClaims = thingConstants.ThingUserChangeClaims.NoClaims

    public usersInfos : UserInfo[] = []
    
    public value: any = {}

    constructor(thingRaw? : ThingRaw) {
        if (thingRaw) {
            Object.assign(this, thingRaw);
            if (thingRaw.value)
                this.value = JSON.parse(thingRaw.value)
        }
    }

    public addThingChild(thingChildRaw : ThingRaw) {
        this.children.unshift(new Thing(thingChildRaw))
    }

    public collapse() : void {
        this.childrenSkip = 0;

        // INFO: Not reset "this.childrenTotalItems = Number.MAX_SAFE_INTEGER" to trace potential Children number
        // this.childrenTotalItems = Number.MAX_SAFE_INTEGER;

        // INFO: Useful to maintain original internal array ref
        this.children.splice(0, this.children.length);
    }

    public shallowCopy() : Thing {

        let copyThing : Thing = new Thing();

        Object.assign(copyThing, this);

        return copyThing;
    }
}