import {UsersGetParams, UsersRawDataSet, UsersDataContext} from "./usersDataContext"

export class UsersManager {
    
    private skip : number = 0;
    private usersTotalItemsCount : number = Number.MAX_SAFE_INTEGER;

    public users : any[] = [];

    private usersGetParams : UsersGetParams = {
        filter : "",
        top : 5,
        skip : this.skip,
        orderBy : ""
    }

    public constructor(){

    }

    public getUser(userId : any) : Promise<any> {
            
        let result : any[] = this.users.filter((user) => { 
            return user.id == userId; 
        });
        if (result.length != 0) {
            return new Promise<any>((resolve, reject) => { 
                resolve(result[0]);
            });
        }
        return UsersDataContext.getUser(userId);
    }

    public getMoreUsers(canceler?: any) : Promise<UsersRawDataSet> {

            var self = this;

            self.usersGetParams.skip = self.skip;

            return UsersDataContext.getUsers(this.usersGetParams, canceler)
            .then(function(data) {

                self.usersTotalItemsCount = data.itemsRange.totalItems;
                self.skip += self.usersGetParams.top;
                //  Fix range
                if (self.skip > self.usersTotalItemsCount) {
                    self.skip = self.usersTotalItemsCount;
                }

                for (var i = 0; i < data.users.length;i++)
                    self.users.push(data.users[i]);

                return data;
            });              
        }

    public get usersItemsCount() : number {
        return this.users.length;        
    }
    public get userTotalItemsCount() : number {
        return this.usersTotalItemsCount;
    }
}