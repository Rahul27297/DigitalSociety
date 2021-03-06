import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
/**
 * Generated class for the CalendarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html',
})
export class CalendarPage {

  public date: Date;
  public daysInThisMonth: Array<number>;
  public daysInLastMonth: any;
  public daysInNextMonth: any;
  public monthNames = ["January","February","March","April","May","June","July","August","Spetember","October","November","December"];
  public currentMonth: any;
  public currentYear: any;
  public currentDate: any;
  public goToNextMonthFlag: boolean;
  public goToPreviousMonthFlag : boolean;
  public selectedDate: any;
  constructor() {
    this.date = new Date();
    this.getDaysOfMonth();
    this.goToNextMonthFlag = true;
    this.goToPreviousMonthFlag = false;
  }

  getDaysOfMonth() {
    this.daysInThisMonth = new Array();
    this.daysInLastMonth = new Array();
    this.daysInNextMonth = new Array();
    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    if(this.date.getMonth() === new Date().getMonth()) {
      this.currentDate = new Date().getDate();
    } else {
      this.currentDate = 999;
    }
  
    var firstDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay();
    //// console.log((firstDayThisMonth);
    var prevNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth(), 0).getDate();
    for(var i = prevNumOfDays-(firstDayThisMonth-1); i <= prevNumOfDays; i++) {
      this.daysInLastMonth.push(i);
    }
  
    var thisNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth()+1, 0).getDate();
    for (let i = 0; i < thisNumOfDays; i++) {
      this.daysInThisMonth.push(i+1);
    }
  
    // console.log((this.daysInThisMonth);
    var lastDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth()+1, 0).getDay();
    var nextNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth()+2, 0).getDate();
    for (let i = 0; i < (6-lastDayThisMonth); i++) {
      this.daysInNextMonth.push(i+1);
    }
    var totalDays = this.daysInLastMonth.length+this.daysInThisMonth.length+this.daysInNextMonth.length;
    if(totalDays<36) {
      for(let i = (7-lastDayThisMonth); i < ((7-lastDayThisMonth)+7); i++) {
        this.daysInNextMonth.push(i);
      }
    }
  }

  goToNextMonth() {
    if(this.goToNextMonthFlag){
      this.goToNextMonthFlag = false;
      this.goToPreviousMonthFlag = true;
      this.date = new Date(this.date.getFullYear(), this.date.getMonth()+2, 0);
      this.getDaysOfMonth();
    }
  }

  goToPreviousMonth() {
    if(this.goToPreviousMonthFlag){
      this.goToNextMonthFlag = true;
      this.goToPreviousMonthFlag = false;
      this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
      this.getDaysOfMonth();
      let d1 = new Date();
      if(this.selectedDate < d1.getDate() || this.selectedDate > this.daysInThisMonth.length){
        this.selectedDate = d1.getDate();
      }
    }
  }

  

  goToLastMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
    this.getDaysOfMonth();
  }

}
