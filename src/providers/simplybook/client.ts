import { Injectable } from "@angular/core";
import { Storage } from '@ionic/storage';


declare var JSONRpcClient;

@Injectable()
export class SimplyBookClient {
    public loginClient:any;
    public client:any;
    public admin: any;
    constructor(public storage: Storage){
         this.loginClient = new JSONRpcClient({
            'url': 'https://user-api.simplybook.me' + '/login',
            'onerror': function (error) {},
        });
        let clienttoken = this.loginClient.getToken('gully', '9d66c361f5bb6d1560265ce1a60b54e348ca3ab3ce963e276fd1a4a43c5ec88e');
        this.client = new JSONRpcClient({
            'url': 'https://user-api.simplybook.me',
            'headers': {
                'X-Company-Login': 'gully',
                'X-Token': clienttoken
            },
            'onerror': function (error) {}
        });
        // // console.log((this.client.getEventList());
        // // console.log((this.client.getUnitList());
        storage.set("clientToken", clienttoken)
        let token = this.loginClient.getUserToken('gully', 'admin' ,'digisoc123');
        // console.log((token);
        storage.set("adminToken", token)
        this.admin = new JSONRpcClient({
            'url': 'https://user-api.simplybook.me' + '/admin/',
            'headers': {
                'X-Company-Login': 'gully',
                'X-User-Token': token
            },
            'onerror': function (error) {}
        });
    }
}