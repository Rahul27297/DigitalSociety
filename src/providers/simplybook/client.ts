import { Injectable } from "@angular/core";

declare var JSONRpcClient;

@Injectable()
export class SimplyBookClient{
    public loginClient:any;
    public client:any;
    constructor(){
         this.loginClient = new JSONRpcClient({
            'url': 'https://user-api.simplybook.me' + '/login',
            'onerror': function (error) {},
        });
        let token = this.loginClient.getToken('sankul', '2bc5e30fd258cc4a89be5fe09396ca7caa481cf33e682abf200a55e8cdb3f80f');
        this.client = new JSONRpcClient({
            'url': 'https://user-api.simplybook.me',
            'headers': {
                'X-Company-Login': 'sankul',
                'X-Token': token
            },
            'onerror': function (error) {}
        });
    }
}