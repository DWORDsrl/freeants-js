import {ItemsRange, HttpRequestCanceler} from "./helpers";
import {ThingsGetParams, ThingsDataContext} from "./thingsDataContext"
import {Thing} from "./thing"

export interface ThingsDataSet {
    things:  Thing[];
    itemsRange: ItemsRange
}

export class ThingsManager {

    public static async getThing(thingId : string) : Promise<Thing> {
        let thingRaw = await ThingsDataContext.getThing(thingId);
        return thingRaw ? new Thing(thingRaw) : null;
    }
    public static async getThings(parameter: ThingsGetParams , canceler: HttpRequestCanceler) : Promise<ThingsDataSet> {
        let thingsRawDataSet = await ThingsDataContext.getThings(parameter, canceler);

        let things : Thing[] = [];
        for (let i = 0; i < thingsRawDataSet.things.length; i++) {
            var thing = new Thing(thingsRawDataSet.things[i]);
            things.push(thing);
        }

        return {
            things : things,
            itemsRange: thingsRawDataSet.itemsRange
        }
    }
    public static deleteThing(thingId : string, recursive : boolean) : Promise<any> {
        if (recursive) {
            return ThingsManager.deleteThingChildren(thingId, recursive)
            .then(function(data) : any {
                return ThingsDataContext.deleteThing(thingId);
            });   
        }

        return ThingsDataContext.deleteThing(thingId);
    }  

    public static getMoreThingChildren(parentThing : Thing, parameter: ThingsGetParams, canceler: HttpRequestCanceler) : Promise<ThingsDataSet> {

        parameter.skip = parentThing.childrenSkip;
        parameter.parentThingId = parentThing.id;

        return ThingsManager.getThings(parameter, canceler)
        .then(function (thingsDataSet : ThingsDataSet) : ThingsDataSet  {

            parentThing.childrenTotalItems = thingsDataSet.itemsRange.totalItems;
            parentThing.childrenSkip = parentThing.childrenSkip + parameter.top;
            //  Fix range
            if (parentThing.childrenSkip > parentThing.childrenTotalItems) {
                parentThing.childrenSkip = parentThing.childrenTotalItems;
            }

            for (var i = 0; i < thingsDataSet.things.length;i++)
                parentThing.children.push(thingsDataSet.things[i]);

            return thingsDataSet;
        });
    }
    public static deleteThingChildren(parentThingId : string, recursive : boolean) : Promise<any> {

        return ThingsDataContext.getThingChildrenIds(parentThingId)
        .then(function (childrenIds : string[]) {

            let childrenPromises : Promise<any>[] = [];

            for (var i = 0; i < childrenIds.length; i++) {
                childrenPromises.push(ThingsManager.deleteThing(childrenIds[i], recursive));
            }

            return Promise.all(childrenPromises);
        });
    } 

}