import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the FirebaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirebaseProvider {

  constructor(public http: HttpClient) {
    console.log('Hello FirebaseProvider Provider');
  }

}

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyBv3L1J2miJU6NkKk6eEa9WrF0jzIK1oOo",
    authDomain: "digitalsociety-c38fd.firebaseapp.com",
    databaseURL: "https://digitalsociety-c38fd.firebaseio.com",
    projectId: "digitalsociety-c38fd",
    storageBucket: "digitalsociety-c38fd.appspot.com",
    messagingSenderId: "1066958523521"
  }
};
