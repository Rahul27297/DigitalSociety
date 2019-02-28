import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
/*
  Generated class for the NoticesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NoticesProvider {

  private firebaseDbNoticesRef: any;
  constructor(private societyId: any) {
    this.firebaseDbNoticesRef = firebase.database().ref('notices');
  }

  getRecentNotices(){

  }

}
