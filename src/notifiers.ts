

// INFO: Useful for future abstration of generic notifier.
//       At this moment is coincident with SignalR.ConnectionState
export const enum ConnectionState {
    Connecting = 0,
    Connected = 1,
    Reconnecting = 2,
    Disconnected = 4
}

// INFO: Useful for future abstration of generic notifier.
//       At this moment is coincident with SignalR.StateChanged
export interface StateChanged {
    oldState: number;
    newState: number;
}

export interface Notifier {

    subscribe() : void;
    unsubscribe() : void;

    setHook(eventName : string, hook : (...msg: any[]) => void) : void;
    remHook(eventName : any, hook : (...msg: any[]) => void) : void;
}

export class SignalRNotifier implements Notifier
{
    private authType : string = "";
    private accessTokenOrApiKeyCallBack : () => void = null;

    private connection : SignalR.Hub.Connection = null;
    private hubProxy : SignalR.Hub.Proxy = null;

    private isStarted : boolean = false;
    private tryReconnection : boolean = false;

    private subscribeSuccessHook : () => void = null;
    private subscribeFailHook : () => void = null;

    constructor(url : string, 
                authType : string, accessTokenOrApiKeyCallBack : () => string, 
                stateChangedHook : (change: StateChanged) => void, reconnectedHook : () => void,
                subscribeSuccessHook : () => void, subscribeFailHook : () => void,) {

        var self = this;

        this.accessTokenOrApiKeyCallBack = accessTokenOrApiKeyCallBack;
        this.authType = authType;

        this.connection = $.hubConnection(url, {
            logging : true,
            useDefaultPath : true
        });
        this.hubProxy = this.connection.createHubProxy("signalrnotifier");

        this.hubProxy.connection.received((data) => { });
        this.hubProxy.connection.error(function (error : SignalR.ConnectionError) { });

        this.hubProxy.connection.stateChanged(function (change : SignalR.StateChanged) {

            if (change.newState === SignalR.ConnectionState.Connected) {
                self.isStarted = true;
                self.tryReconnection = true;
            }
            else if (change.newState === SignalR.ConnectionState.Disconnected) {
                self.isStarted = false;
            }
            else if (change.newState === SignalR.ConnectionState.Connecting) {
            }
            else if (change.newState === ConnectionState.Reconnecting) {
            }

            if (stateChangedHook != null) {
                stateChangedHook(change);
            }
        });
        this.hubProxy.connection.reconnected(function () {
            if (reconnectedHook != null)
                reconnectedHook();
        });
        this.hubProxy.connection.starting(function () { });
        this.hubProxy.connection.connectionSlow(function () { });
        this.hubProxy.connection.reconnecting(function () { });
        this.hubProxy.connection.disconnected(function () {
            if (self.tryReconnection == false)
                return;

            setTimeout(function () {
                self.subscribe();
            }, 5000); // Restart connection after 5 seconds.
        });

        this.subscribeSuccessHook = subscribeSuccessHook;
        this.subscribeFailHook = subscribeFailHook;
    }

    public subscribe() : void {

        var self = this;

        if (self.isStarted == true)
            return;

        let accessTokenOrApiKeyJson = "{\"" + self.authType + "\":\"" + self.accessTokenOrApiKeyCallBack() + "\"}";
        self.hubProxy.connection.qs = JSON.parse(accessTokenOrApiKeyJson);

        self.hubProxy.connection.start()
        .done(function () {
            if (self.subscribeSuccessHook != null)
                self.subscribeSuccessHook();
        })
        .fail(function () {
            if (self.subscribeFailHook != null)
                self.subscribeFailHook();
        });
    }
    public unsubscribe() : void {

        if (this.isStarted == false)
            return;

        this.tryReconnection = false;
        this.hubProxy.connection.stop();
    }

    public setHook(eventName : string, hook : (...msg: any[]) => void) {
        this.hubProxy.on(eventName, hook);
    }
    public remHook(eventName : any, hook : (...msg: any[]) => void) {
        this.hubProxy.off(eventName, hook);
    }      
}
