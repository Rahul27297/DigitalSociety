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
declare var JSONRpcClient;

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
	private isValidDateAndTimeSelected: boolean;
	public newClient: any;
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
		// this.storage.get('clientToken').then((val) => {
		// 	console.log(val)
	
			let slots = this.newClient.getStartTimeMatrix(this.todayDate,this.todayDate,this.facility.service_id_in_simplybook,this.societyId,1);
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
			this.calendar.selectedDate = this.currentDate;
			this.selectedSlotTime = false;

		//this.currentDate = this.simplyBookClient.client.getFirstWorkingDay();

	}

	ionViewWillEnter(){
		this.isValidDateAndTimeSelected = false;
		this.loader = this.loadingCtrl.create({
			content: "Please wait..."
		});
		this.loader.present();

	}

	ionViewDidEnter(){
		this.storage.get('clientToken').then((val) => {
			console.log(val)
			this.newClient = new JSONRpcClient({
				'url': 'https://user-api.simplybook.me',
				'headers': {
					'X-Company-Login': 'gully',
					'X-Token': val
				},
				'onerror': function (error) {}
			});
			this.loader.dismiss();
			this.setup();
		});

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
		this.isValidDateAndTimeSelected = true;
	}

	proceedBook(){
		console.log(this.calendar)
		let date = this.calendar.date.getFullYear().toString() + "-" + (this.calendar.date.getMonth()+1).toString() + "-" +this.calendar.selectedDate.toString();
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
		this.loader = this.loadingCtrl.create({
			content: "Please Wait..."
		});
		this.loader.present();
		console.log(day)
		if(this.calendar.goToPreviousMonthFlag || this.currentDate <= day ){
			if(this.calendar.goToNextMonthFlag && day < this.currentDate){
				console.log("here 2")
				this.calendar.selectedDate = this.currentDate;	
			}
			else{
				console.log("here 5")

				this.calendar.selectedDate = day;
			}
			console.log(this.calendar.selectedDate,day+month+year);
			let date = new Date(this.calendar.date.getFullYear(),this.calendar.date.getMonth(),day);
			let slots = this.newClient.getStartTimeMatrix(date,date,this.facility.id,this.societyId,1);
			console.log(slots);
			this.loader.dismiss();
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
		this.selectedSlotTime = false;
		this.isValidDateAndTimeSelected = false;
	}
}


