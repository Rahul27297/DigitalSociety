import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CalendarPage } from '../calendar/calendar';
import { SimplyBookClient } from '../../providers/simplybook/client';
import { BookingConfirmationPage } from '../booking-confirmation/booking-confirmation';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
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
	private areSlotsAvailable: any;
	private societyId: any;
    constructor(private navController:NavController, private navParams:NavParams, private loadingCtrl: LoadingController, private storage: Storage) {
		this.societyId = navParams.get('societyId');
		this.calendar = new CalendarPage();
		this.selectedSlot = "transparent";
		this.todayDate = new Date();
		this.currentDate = this.todayDate.getDate();
		this.calendar.selectedDate = this.currentDate;
		//console.log(this.currentDate);
		this.facility = this.navParams.get('facility');
		this.areSlotsAvailable = true;
		//console.log(this.facility);
	}
	
	setup(){
		this.simplyBookClient = new SimplyBookClient();
		//this.currentDate = this.simplyBookClient.client.getFirstWorkingDay();
		let slots = this.simplyBookClient.client.getStartTimeMatrix(this.todayDate,this.todayDate,this.facility.service_id_in_simplybook,this.societyId,1);
		console.log(slots);
		this.slotsArray = Object.getOwnPropertyDescriptor(slots,Object.keys(slots)[0]).value;
		console.log(this.slotsArray);
		if(this.slotsArray.length == 0){
			console.log("here", this.slotsArray.length)
			this.areSlotsAvailable = false;
		}
		else {
			console.log("here", this.slotsArray.length)

			this.areSlotsAvailable = true;
		}

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
		this.selectedSlot = "color($colors, primary-dark)";
		this.selectedSlotTime = slot;
	}

	proceedBook(){
		let date = this.calendar.date.getFullYear().toString() + "-" + (this.calendar.date.getMonth()+1).toString() + "-" +this.currentDate.toString();
		console.log("booking date" + date);
		this.navController.push(BookingConfirmationPage, {
			facilityId: this.facility.service_id_in_simplybook,
			facilityName: this.facility.display_name,
			startDate: date,
			startTime: this.selectedSlotTime,
			societyId: this.societyId,
			facilityTnC: this.facility.terms_and_conditions
		});
	}

	dateSelected(day,month,year){
		if(this.calendar.goToPreviousMonthFlag || this.currentDate <= day ){
			if(this.calendar.goToNextMonthFlag && day < this.currentDate){
				this.calendar.selectedDate = this.currentDate;	
			}
			else{
				this.calendar.selectedDate = day;
			}
			console.log(day+month+year);
			let date = new Date(this.calendar.date.getFullYear(),this.calendar.date.getMonth(),day);
			let slots = this.simplyBookClient.client.getStartTimeMatrix(date,date,this.facility.id,this.societyId,1);
			console.log(slots);
			this.slotsArray = Object.getOwnPropertyDescriptor(slots,Object.keys(slots)[0]).value;
			if(this.slotsArray.length == 0){
				console.log("here", this.slotsArray.length)
				this.areSlotsAvailable = false;
			}
			else {
				console.log("here", this.slotsArray.length)
	
				this.areSlotsAvailable = true;
			}
		}
	}
}


