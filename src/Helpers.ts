import {AccountManager} from "./AccountManager"
export class Helpers {

    public static get securityHeaders() : any {

        var accessToken = AccountManager.accessToken;
        if (accessToken) {
            return { "Authorization": "Bearer " + accessToken };
        }
        var apiKey = AccountManager.apiKey;
        if (apiKey) {
            return { "DWApiKey": apiKey };
        }
        return {};
    }
}