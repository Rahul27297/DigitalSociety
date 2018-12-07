import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CalendarPage } from '../calendar/calendar';
import { SimplyBookClient } from '../../providers/simplybook/client';
import { BookingConfirmationPage } from '../booking-confirmation/booking-confirmation';
import { LoadingController } from 'ionic-angular';
/**
 * Generated class for the BfacilityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bfacility',
  templateUrl: 'bfacility.html',
})
export class BfacilityPage {
  
	public calendar:CalendarPage;  
	public facility:any;
	public currentDate:any;
	public simplyBookClient: SimplyBookClient;
	public todayDate: any;
	public slotsArray: Array<{time: string}>;
	public selectedSlot: any;
	public selectedSlotTime:any;
	private loader: any;
    constructor(private navController:NavController, private navParams:NavParams, private loadingCtrl: LoadingController) {
		this.calendar = new CalendarPage();
		this.selectedSlot = "transparent";
		this.todayDate = new Date();
		this.currentDate = this.todayDate.getDate();
		//console.log(this.currentDate);
		this.facility = this.navParams.get('facility');
		//console.log(this.facility);
	}
	
	setup(){
		this.simplyBookClient = new SimplyBookClient();
		//this.currentDate = this.simplyBookClient.client.getFirstWorkingDay();
		let slots = this.simplyBookClient.client.getStartTimeMatrix(this.todayDate,this.todayDate,this.facility.id,1,1);
		console.log(slots);
		this.slotsArray = Object.getOwnPropertyDescriptor(slots,Object.keys(slots)[0]).value;
	}

	ionViewDidLoad(){
		this.loader = this.loadingCtrl.create({
			content: "Please wait..."
		});
		this.loader.present();
	}

	ionViewDidEnter(){
		this.setup();
		this.loader.dismiss();
	}
	hello(){
		console.log("hello");
	}

	getMonthNumber(){

	}

	slotSelected(slot){
		console.log(slot);
		this.selectedSlot = "#0091ea";
		this.selectedSlotTime = slot;
	}

	proceedBook(){
		let date = this.calendar.date.getFullYear().toString() + "-" + this.calendar.date.getMonth().toString() + "-" +this.currentDate.toString();
		console.log("booking date" + date);
		this.navController.push(BookingConfirmationPage, {
			facilityId: this.facility.id,
			facilityName: this.facility.name,
			startDate: date,
			startTime: this.selectedSlotTime
		});
	}

	dateSelected(day,month,year){
		this.currentDate = day;
		console.log(day+month+year);
		let date = new Date(this.calendar.date.getFullYear(),this.calendar.date.getMonth(),day);
		let slots = this.simplyBookClient.client.getStartTimeMatrix(date,date,this.facility.id,1,1);
		console.log(slots);
		this.slotsArray = Object.getOwnPropertyDescriptor(slots,Object.keys(slots)[0]).value;
	}
}


