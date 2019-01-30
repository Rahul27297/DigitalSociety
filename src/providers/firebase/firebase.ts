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
    apiKey: "AIzaSyDzZ9uUcI4doYZ453JXlfXkuxVZ5fvLw_w",
    authDomain: "upgraded-server.firebaseapp.com",
    databaseURL: "https://upgraded-server.firebaseio.com",
    projectId: "upgraded-server",
    storageBucket: "upgraded-server.appspot.com",
    messagingSenderId: "3609552384"
  }
};
