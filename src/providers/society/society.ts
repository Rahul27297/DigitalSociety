import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
/*
  Generated class for the NoticesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SocietiesProvider {

  private societyData: any;
  constructor() {
    this.societyData = {}
  }

  init(info: any) {
    // info is returns the society with a society ID. init function is called
    // in login.ts
    // // console.log((info)
    this.societyData = info;
  }

  getAllSocietiesInfo() {

  }

  getSocietyInfoByMemberEmailId() {

  }

}
