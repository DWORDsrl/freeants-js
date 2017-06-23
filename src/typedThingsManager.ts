import {ItemsRange,HttpFailResult, HttpRequestCanceler} from "./helpers";
import * as thingConstants from "./thingConstants";
import {ThingUserReadClaims, ThingUserChangeClaims} from "./thingConstants"
import {ThingPosition, ThingPositionRaw } from "./thingPosition"
import {ThingUserRightsRaw} from "./thingUserRights"
import {Thing, ThingRaw} from "./thing"
import {ThingsGetParams} from "./thingsDataContext"
import {ThingsDataSet, ThingsManager} from "./thingsManager"
import {Notifier} from "./notifiers"
import {UsersManager} from "./UsersManager"

export interface ThingClaims {

    PublicReadClaims : ThingUserReadClaims;
    PublicChangeClaims: ThingUserChangeClaims;
    EveryoneReadClaims: ThingUserReadClaims;
    EveryoneChangeClaims: ThingUserChangeClaims;
    
    CreatorUserReadClaims: ThingUserReadClaims;
    CreatorUserChangeClaims: ThingUserChangeClaims;
}

export class TypedThingsManager {

    private thingClaims : ThingClaims = null;
    private thingKind : string = null;
    private mainThing : Thing = null;

    public things : Thing[] = [];

    private getThingsParams : ThingsGetParams = null;
    private getChindrenThingsParams : ThingsGetParams = null;

    private notifier : Notifier = null;

    // Fat arrow syntax is useful for safe "this" access
    private onCreateThing = (thingRaw : ThingRaw) : void => {
       
        if (thingRaw.kind == this.thingKind) {
            ThingsManager.addThingChild(this.mainThing, thingRaw);
            setTimeout(null, 1);
            return;
        }
    }
    private onUpdateThing = (thingRaw : ThingRaw) : void => {
    }
    private onDeleteThing = (thingId : string) : void => {
    }

    private onUpdateThingValue = (thingId : string, value : any) : void => {
    }

    private onUpdateThingPosition = (position : ThingPositionRaw) : void => {
    }

    private onCreateChildThingId = (parentId : string, childId : string, kind : string) : void => {
    }
    private onDeleteChildThingId = (parentId : string, childId : string, kind : string) : void => {
    }

    private onCreateThingUserRights = (thingId : string, userRights : ThingUserRightsRaw) : void => {
    }
    private onUpdateThingUserRights = (thingId : string, userRights : ThingUserRightsRaw) : void => {
    }
    private onDeleteThingUserRights = (thingId : string, userId : string)  : void => {        
    }

    constructor(mainThing : Thing, thingKind : string, thingClaims : ThingClaims, usersManager : UsersManager, notifier : Notifier) {

        this.thingClaims = thingClaims;

        this.thingKind = thingKind;

        this.mainThing = mainThing;
        this.things = this.mainThing.children;

        this.getThingsParams = {
            // Viene sovrascritto da thingsManager
            parentThingId: null,
            filter: "Kind eq '" + this.thingKind + "'",
            top: 10,
            skip: 0,
            deleteStatus : thingConstants.ThingDeletedStatus.Ok,
            orderBy: null,
            valueFilter: null
        }
        this.getChindrenThingsParams = {
            // Viene sovrascritto da thingsManager
            parentThingId: null,
            filter: "",
            top: 10,
            // Viene sovrascritto da thingsManager
            skip: 0,
            deleteStatus : thingConstants.ThingDeletedStatus.Ok,
            orderBy: null,
            valueFilter: null
        }

        this.notifier = notifier;
        
        notifier.setHook("onCreateThing", this.onCreateThing);
        notifier.setHook("onUpdateThing", this.onUpdateThing);
        notifier.setHook("onDeleteThing", this.onDeleteThing);

        notifier.setHook("onUpdateThingValue", this.onUpdateThingValue);

        notifier.setHook("onUpdateThingPosition", this.onUpdateThingPosition);

        notifier.setHook("onCreateChildThingId", this.onCreateChildThingId);
        notifier.setHook("onDeleteChildThingId", this.onDeleteChildThingId);

        notifier.setHook("onCreateThingUserRights",this.onCreateThingUserRights);
        notifier.setHook("onUpdateThingUserRights", this.onUpdateThingUserRights);
        notifier.setHook("onDeleteThingUserRights", this.onDeleteThingUserRights);
    }
    public dispose() : void {

        this.notifier.remHook("onDeleteThingUserRights", this.onUpdateThingUserRights);
        this.notifier.remHook("onUpdateThingUserRights", this.onUpdateThingUserRights);
        this.notifier.remHook("onCreateThingUserRights",this.onCreateThingUserRights);
        this.notifier.remHook("onDeleteChildThingId", this.onDeleteChildThingId);
        this.notifier.remHook("onCreateChildThingId", this.onCreateChildThingId);
        this.notifier.remHook("onUpdateThingValue", this.onUpdateThingValue);
        this.notifier.remHook("onDeleteThing", this.onDeleteThing);
        this.notifier.remHook("onUpdateThing", this.onUpdateThing);
        this.notifier.remHook("onCreateThing", this.onCreateThing);

    }

    private getMoreThingChildren(thing : Thing, canceler : HttpRequestCanceler) : Promise<ThingsDataSet | HttpFailResult> {
        return ThingsManager.getMoreThingChildren(thing, this.getChindrenThingsParams, canceler)
    }

    public getMoreThings = (canceler : HttpRequestCanceler) : Promise<any  | HttpFailResult> => {
        
        let self = this;

        return new Promise<ThingsDataSet[]>((resolve, reject) => {

            ThingsManager.getMoreThingChildren(this.mainThing, this.getThingsParams, canceler)
            .then(function (data : ThingsDataSet) : any {

                let promises : Promise<ThingsDataSet>[] = [];

                // Try to get all things children
                for (let i = 0; i < data.things.length; i++)
                    promises.push(self.getMoreThingChildren(data.things[i], canceler));

                Promise.all(promises)
                .then(function(data : ThingsDataSet[]) : any {
                    resolve(data);
                    return data;
                })
                .catch(function(data) : HttpFailResult {
                    reject(data);
                    return data;
                });

                return data;
                
            })
            .catch(function(data) : HttpFailResult {
                reject(data);
                return data;
            })
        });
    }

    public getThingsTotalItems() : Number {
        return this.mainThing.childrenTotalItems;
    }
}