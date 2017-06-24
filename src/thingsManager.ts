import {ItemsRange, HttpRequestCanceler, HttpFailResult} from "./helpers";
import {ThingsRawDataSet, ThingsGetParams, ThingsDataContext} from "./thingsDataContext"
import {ThingPosition} from "./thingPosition";
import {ThingRaw, Thing} from "./thing"

export interface ThingsDataSet {
    things:  Thing[];
    itemsRange: ItemsRange
}

export class ThingsManager {

    // ThingDataContext Proxy section
    //
    public static async getThing(thingId : string) : Promise<Thing | HttpFailResult> {

        let thingRaw : ThingRaw = null
        try {
            thingRaw = await ThingsDataContext.getThing(thingId)
        }
        catch(response){
            throw response
        }
        return thingRaw ? new Thing(thingRaw) : null;
    }
    public static async getThings(parameter: ThingsGetParams , canceler: HttpRequestCanceler) : Promise<ThingsDataSet | HttpFailResult> {

        let thingsRawDataSet : ThingsRawDataSet = null
        let things : Thing[] = []
        
        try {

            thingsRawDataSet = await ThingsDataContext.getThings(parameter, canceler);
            
            for (let i = 0; i < thingsRawDataSet.things.length; i++) {
                var thing = new Thing(thingsRawDataSet.things[i])
                things.push(thing)
            }
        }
        catch(response) {
            throw response as HttpFailResult
        }

        return {
            things : things,
            itemsRange: thingsRawDataSet.itemsRange
        }
    }
    public createThing(thing : Thing) : Promise<Thing | HttpFailResult> {
        
        let thingRaw : ThingRaw;
        Object.assign(thingRaw, thing);

        return ThingsDataContext.createThing(thingRaw)
        .then(function (thingRaw) : Thing {
            return new Thing(thingRaw);
        });
    }
    public updateThing(thing : Thing) : Promise<Thing | HttpFailResult> {

        let thingRaw : ThingRaw;
        Object.assign(thingRaw, thing);

        return ThingsDataContext.updateThing(thing.id, thingRaw)
        .then(function (thingRaw) : Thing {
            return new Thing(thingRaw);
        });
    }
    public static deleteThing(thingId : string, recursive : boolean) : Promise<any | HttpFailResult> {
        if (recursive) {
            return ThingsManager.deleteThingChildren(thingId, recursive)
            .then(function(data) : any {
                return ThingsDataContext.deleteThing(thingId);
            });   
        }

        return ThingsDataContext.deleteThing(thingId);
    }

    // INFO: Fills parentThing
    public static getMoreThingChildren(parentThing : Thing, parameter: ThingsGetParams, canceler: HttpRequestCanceler) : Promise<ThingsDataSet | HttpFailResult> {

        parameter.skip = parentThing.childrenSkip;
        parameter.parentThingId = parentThing.id;

        return ThingsManager.getThings(parameter, canceler)
        .then(function (thingsDataSet : ThingsDataSet) : ThingsDataSet  {

            parentThing.childrenTotalItems = thingsDataSet.itemsRange.totalItems;
            parentThing.childrenSkip = parentThing.childrenSkip + parameter.top;
            //  Fix range
            if (parentThing.childrenSkip > parentThing.childrenTotalItems)
                parentThing.childrenSkip = parentThing.childrenTotalItems;            

            for (var i = 0; i < thingsDataSet.things.length;i++)
                parentThing.children.push(thingsDataSet.things[i]);   

            return thingsDataSet;
        });
    }
    public static deleteThingChildren(parentThingId : string, recursive : boolean) : Promise<any | HttpFailResult> {

        return ThingsDataContext.getThingChildrenIds(parentThingId)
        .then(function(childrenIds : string[]) : any {

            let childrenPromises : Promise<any>[] = [];

            for (var i = 0; i < childrenIds.length; i++)
                childrenPromises.push(ThingsManager.deleteThing(childrenIds[i], recursive));

            return Promise.all(childrenPromises)
        });
    }

    public static putThingsPositions(positions: ThingPosition[]) : Promise<any  | HttpFailResult> {
        return ThingsManager.putThingsPositions(positions)
    }

    // Thing Proxy section
    //
    public static addThingChild(thing : Thing, thingChildRaw : ThingRaw) : void {
        thing.addThingChild(thingChildRaw);
    }
    public static collapseThing(thing : Thing) : void {
        thing.collapse();
    }

}