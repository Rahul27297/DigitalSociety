import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
/*
  Generated class for the NoticesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {

  private isUserLoggedin: any = false;
  private userKey: any = null;
  private userData: any;
  constructor() {
    this.userData = {}
  }

  init(info: any, isUserLoggedin, userKey) {
    // info is returns the society with a society ID. init function is called
    // in login.ts
    // // console.log((info)
    this.userKey = userKey;
    this.isUserLoggedin = isUserLoggedin;
    this.userData = info;
    // console.log((this.userData);
  }


}
