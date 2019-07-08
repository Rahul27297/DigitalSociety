import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CalendarPage } from '../calendar/calendar';
import { SimplyBookClient } from '../../providers/simplybook/client';
import { BookingConfirmationPage } from '../booking-confirmation/booking-confirmation';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { BookingProvider } from '../../providers/booking/booking';
import { SocietiesProvider } from '../../providers/society/society';

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
	public slotsArray: any;
	public selectedSlot: any;
	public selectedSlotTime:any;
	private loader: any;
	private areSlotsAvailable: any;
	private societyId: any;
	private isValidDateAndTimeSelected: boolean;
	public newClient: any;
	private endTime: any;
	public simplyBookDateFormat: any;
	constructor(public societiesProvider: SocietiesProvider, public bookingProvider: BookingProvider, private navController:NavController, private navParams:NavParams, private loadingCtrl: LoadingController, private storage: Storage) {
		this.societyId = this.societiesProvider['societyData']['society_id'];
		
		this.calendar = new CalendarPage();
		this.selectedSlot = "transparent";
		this.todayDate = new Date();
		this.currentDate = this.todayDate.getDate();
		this.calendar.selectedDate = this.currentDate;
		//// console.log((this.currentDate);
		this.facility = this.bookingProvider['facilityInfo'];
		// console.log((this.facility, this.societyId)
		this.areSlotsAvailable = true;
		//// console.log((this.facility);
	}
	
	setup(){
		// this.storage.get('clientToken').then((val) => {
		// 	// console.log((val)
			// console.log((this.facility)
			let slots = this.newClient.getStartTimeMatrix(this.todayDate,this.todayDate,this.facility.service_id_in_simplybook,this.facility.service_provider_id_in_simplybook,1);
		
			this.slotsArray = Object.getOwnPropertyDescriptor(slots,Object.keys(slots)[0]).value;
			// console.log((this.slotsArray);
			
			if(this.slotsArray.length == 0){
				// console.log(("here", this.slotsArray.length)
				this.areSlotsAvailable = false;		
			}
			else {
				// console.log((this.slotsArray);
				// console.log(("here", this.slotsArray.length)
				this.areSlotsAvailable = true;
				
				for (let i = 0; i < this.slotsArray.length; i = i + 1) {
					let timeArray = this.slotsArray[i].split(":");
					this.slotsArray[i] = timeArray[0] + ":" + timeArray[1];
					// console.log((this.slotsArray[i]);
				}
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
			// console.log((val)
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
		// console.log(("hello");
	}

	getMonthNumber(){

	}

	slotSelected(slot){
		this.selectedSlot = "color($colors, primary-dark)";
		this.selectedSlotTime = slot  ;
		this.loader = this.loadingCtrl.create({
			content: "Please Wait..."
		});
		this.loader.present().then(() => {
			// Your logic to load content
			// console.log(("hihere")
			// console.log((slot);

			this.isValidDateAndTimeSelected = true;
			let date = this.calendar.date.getFullYear().toString() + "-" + (this.calendar.date.getMonth()+1).toString() + "-" +this.calendar.selectedDate.toString();
			// console.log((date)
			this.simplyBookDateFormat = date;
			this.endTime = this.newClient.calculateEndTime(date + " " + this.selectedSlotTime, this.facility.service_id_in_simplybook, this.facility.service_provider_id_in_simplybook);
			this.endTime = this.endTime.split(" ")[1]
			let endTimeHH = this.endTime.split(":")[0]
			let endTimeMM = this.endTime.split(":")[1]
			this.endTime = endTimeHH+":"+endTimeMM;
			// console.log((endTimeHH, endTimeMM);
			this.loader.dismiss();
		});

	}

	proceedBook(){
		// console.log((this.calendar)
		let date = this.calendar.date.getFullYear().toString() + "-" + (this.calendar.date.getMonth()+1).toString() + "-" +this.calendar.selectedDate.toString();
		// console.log(("booking date" + date+" "+this.selectedSlotTime);
		// // console.log((endTime)
		this.bookingProvider.init({
			facilityId: this.facility.service_id_in_simplybook,
			serviceProviderIdInSimplybook: this.facility.service_provider_id_in_simplybook,
			facilityName: this.facility.display_name,
			startDate: date,
			startTime: this.selectedSlotTime,
			combinedStartTimeAndDate: date+ " " + this.selectedSlotTime,
			simplyBookDateFormat: this.simplyBookDateFormat,
			endTime: this.endTime,
			societyId: this.societyId,
			facilityTnC: this.facility.terms_and_conditions
		})

		this.navController.push(BookingConfirmationPage, {});
	}

	dateSelected(day,month,year){
		this.loader = this.loadingCtrl.create({
			content: "Please Wait..."
		});
		// console.log((day)
		if(this.calendar.goToPreviousMonthFlag || this.currentDate <= day ){

			if(this.calendar.goToNextMonthFlag && day < this.currentDate){
				// console.log(("here 2")
				this.calendar.selectedDate = this.currentDate;	
			}
			else{
				// console.log(("here 5")

				this.calendar.selectedDate = day;
			}
			// console.log((this.calendar.selectedDate,day+month+year);
			let date = new Date(this.calendar.date.getFullYear(),this.calendar.date.getMonth(),day);
			// console.log((this.facility)
			this.loader.present().then(() => {
				// Your logic to load content
				let slots = this.newClient.getStartTimeMatrix(date,date,this.facility.service_id_in_simplybook,this.facility.service_provider_id_in_simplybook,1);
				// console.log((slots);
				this.slotsArray = Object.getOwnPropertyDescriptor(slots,Object.keys(slots)[0]).value;
				if(this.slotsArray.length == 0){
					// console.log(("here", this.slotsArray.length)
					this.areSlotsAvailable = false;
				}
				else {
					// console.log(("here", this.slotsArray.length)
					this.areSlotsAvailable = true;
					for (let i = 0; i < this.slotsArray.length; i = i + 1) {
						let timeArray = this.slotsArray[i].split(":");
						this.slotsArray[i] = timeArray[0] + ":" + timeArray[1];
						// console.log((this.slotsArray[i]);
					}
				}		
				this.loader.dismiss();	
			});
	
		}
		this.selectedSlotTime = false;
		this.isValidDateAndTimeSelected = false;
	}
}


