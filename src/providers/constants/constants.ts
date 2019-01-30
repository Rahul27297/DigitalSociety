import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ConstantsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConstantsProvider {

  public static NETWORK_CONNECTED: string = "Network Connected";
  public static NETWORK_DISCONNECTED: string = "Network Disconnected";
  public static TOAST_STANDARD_DURATION: number = 3000;
  public static TITLE_PAGE_HOME: string = "Home";
  public static TITLE_PAGE_MY_BOOKINGS: string = "My Bookings";
  public static TITLE_PAGE_PROFILE: string = "Profile";
  public static TITLE_PAGE_LOGOUT: string = "Logout";
  public static LOGOUT_CONFIRMATION: string = "Are you sure you want to logout?";
  public static YES = "Yes";
  public static NO = "NO";
  public static LOADER_PLEASE_WAIT = "Please Wait...";
  public static LOGOUT_SUCCESS = "Logged Out Successfully";

  constructor() {
    console.log('Hello ConstantsProvider Provider');
  }

}
