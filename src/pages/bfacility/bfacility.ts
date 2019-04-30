import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CalendarPage } from '../calendar/calendar';
import { SimplyBookClient } from '../../providers/simplybook/client';
import { BookingConfirmationPage } from '../booking-confirmation/booking-confirmation';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Title } from '@angular/platform-browser';
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
	public newClientAdmin : any;
	private endTime: any;
	public simplyBookDateFormat: any;
	private ruleEngineInstance : any;
	private clientEmail : any;
	private clientBookings : any;
	public goToNextMonthFlag: boolean;
	public goToPreviousMonthFlag : boolean;
	public ruleS01 : any;
	public limitDate : any;
	public isSelected : any;
	public isMonthToggled : any;
	public dateSelectedString: any;
	constructor(private navController:NavController, private navParams:NavParams, private loadingCtrl: LoadingController, private storage: Storage) {
		this.societyId = navParams.get('societyId');
		this.selectedSlot = "transparent";
		//console.log(this.currentDate);
		this.calendar = new CalendarPage();		
		this.todayDate = new Date();
		this.dateSelectedString = this.todayDate.getDate() + " " + this.calendar.currentMonth + " " + this.calendar.currentYear;
		//this.goToNextMonthFlag = true;
		this.currentDate = this.todayDate.getDate();
		this.calendar.selectedDate = this.currentDate;
		this.facility = this.navParams.get('facility');
		this.areSlotsAvailable = true;
		this.isSelected = false;
		let ruleIdentifier = this.facility.ruleNumber.split(",");
		let ruleValue = this.facility.ruleValue.split(",");
		let ruleS01index = ruleIdentifier.indexOf("S01");
		if (ruleS01index === -1) {
			this.ruleS01 = 60;
		}
		else {
			this.ruleS01 = +ruleValue[ruleS01index];
		}
		console.log(this.ruleS01);
		this.limitDate = new Date();
		this.limitDate.setDate(this.limitDate.getDate() + this.ruleS01);
		console.log(this.limitDate);
		//console.log(this.facility);
		this.goToPreviousMonthFlag = false;
		if (this.calendar.date.getFullYear() === this.limitDate.getFullYear()) {
			console.log(this.calendar.date.getMonth());
			if (this.calendar.date.getMonth() < this.limitDate.getMonth()){
				this.goToNextMonthFlag = true;
			}
			else{
				this.goToNextMonthFlag = false;
			}
		}
		else {
			if (this.calendar.date.getMonth() >= this.limitDate.getMonth()){
				this.goToNextMonthFlag = true;
			}
			else{
				this.goToNextMonthFlag = false;
			}
		}
		
	}
	
	setup(){
		// this.storage.get('clientToken').then((val) => {
		// 	console.log(val)
			console.log(this.facility)
			let slots = this.newClient.getStartTimeMatrix(this.todayDate,this.todayDate,this.facility.service_id_in_simplybook,this.facility.service_provider_id_in_simplybook,1);
		
			this.slotsArray = Object.getOwnPropertyDescriptor(slots,Object.keys(slots)[0]).value;
			console.log(this.slotsArray);
			
			if(this.slotsArray.length == 0){
				console.log("here", this.slotsArray.length)
				this.areSlotsAvailable = false;		
			}
			else {
				console.log(this.slotsArray);
				console.log("here", this.slotsArray.length)
				this.areSlotsAvailable = true;
				
				for (let i = 0; i < this.slotsArray.length; i = i + 1) {
					let timeArray = this.slotsArray[i].split(":");
					this.slotsArray[i] = timeArray[0] + ":" + timeArray[1];
					console.log(this.slotsArray[i]);
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
			console.log(val)
			this.newClient = new JSONRpcClient({
				'url': 'https://user-api.simplybook.me',
				'headers': {
					'X-Company-Login': 'gully',
					'X-Token': val
				},
				'onerror': function (error) {}
			});

			this.storage.get('adminToken').then((val) => {
				console.log(val)
				this.newClientAdmin = new JSONRpcClient({
				  'url': 'https://user-api.simplybook.me' + '/admin/',
				  'headers': {
					  'X-Company-Login': 'gully',
					  'X-User-Token': val
				  },
				  'onerror': function (error) {}
				  });
				  
				//getClientUpcomingBookings returns a promise. This is to ensre we fetch client Bookings first.  
				this.getClientUpcomingBookings().then(() => {
									
					
			
					//create instance for rule engine.
					this.ruleEngineInstance = new ruleEngineFactory(this.navParams.get('facility'), this.newClient, this.clientBookings);

					this.ruleEngineInstance.ruleEngineDriver(new Date());
					this.dateSelectedString = new Date().getDate() + " " + this.calendar.currentMonth + " " + this.calendar.currentYear;
					this.slotsArray = this.ruleEngineInstance.getSlotArray();
					if (this.slotsArray.length == 0) this.areSlotsAvailable = false;
					else this.areSlotsAvailable = true;
					this.loader.dismiss();
				});
			});
			
			//this.setup();
		});

	}

	goToNextMonth() {
		let date = new Date();
		date.setMonth(11);
		date.setDate(date.getDate() + 45);
		console.log(this.limitDate.getFullYear());

		console.log(this.goToNextMonthFlag);
		if(this.goToNextMonthFlag){
		  this.isSelected = false;
		  this.goToNextMonthFlag = false;//this is overridden below
		  this.goToPreviousMonthFlag = true;
		  this.calendar.date = new Date(this.calendar.date.getFullYear(), this.calendar.date.getMonth()+2, 0);
		  this.calendar.getDaysOfMonth();
		}

		if (this.calendar.date.getFullYear() === this.limitDate.getFullYear()) {
			console.log(this.calendar.date.getMonth());
			if (this.calendar.date.getMonth() < this.limitDate.getMonth()){
				this.goToNextMonthFlag = true;
			}
			else{
				this.goToNextMonthFlag = false;
			}
		}
		else{
			if (this.calendar.date.getMonth() > this.limitDate.getMonth()){
				this.goToNextMonthFlag = true;
			}
			else{
				this.goToNextMonthFlag = false;
			}
		}
		console.log(this.calendar.currentDate);
		console.log(this.calendar.selectedDate);
	  }
	
	  goToPreviousMonth() {
		if(this.goToPreviousMonthFlag){
		  this.goToNextMonthFlag = true;
		  this.isSelected = false;
		  this.goToPreviousMonthFlag = false;//overridden below
		  this.calendar.date = new Date(this.calendar.date.getFullYear(), this.calendar.date.getMonth(), 0);
		  this.calendar.getDaysOfMonth();
		  let d1 = new Date();
		  if(this.calendar.selectedDate < d1.getDate() || this.calendar.selectedDate > this.calendar.daysInThisMonth.length){
			this.calendar.selectedDate = d1.getDate();
		  }
		}

		let date = new Date();
		if (this.calendar.date.getFullYear() === date.getFullYear()) {
			console.log(this.calendar.date.getMonth());
			if (this.calendar.date.getMonth() > date.getMonth()){
				this.goToPreviousMonthFlag = true;
			}
			else{
				this.goToPreviousMonthFlag = false;
			}
		}
		else{
			if (this.calendar.date.getMonth() < this.limitDate.getMonth()){
				this.goToPreviousMonthFlag = true;
			}
			else{
				this.goToPreviousMonthFlag = false;
			}
		}

	  }

	getClientUpcomingBookings() {
		return new Promise((resolve, reject) => {
			this.storage.get('Info').then((val) => {
				this.clientEmail = val.email;
				console.log(this.clientEmail)
				let currentDateAndTime = new Date();
				console.log(currentDateAndTime)
				let dd = 1//currentDateAndTime.getDate();//to fetch all bookings in current month
				let mm = currentDateAndTime.getMonth()+1;
				let yyyy = currentDateAndTime.getFullYear();
				let HH = currentDateAndTime.getHours();
				let MM = currentDateAndTime.getMinutes();
				let SS = currentDateAndTime.getSeconds();
				this.clientBookings = this.newClientAdmin.getBookings({
				  "client_email": this.clientEmail,
				  "date_from": yyyy+"-"+mm+"-"+dd,
				  // "time_from": HH+":"+MM+":"+SS,    // will fetch all bookings after this particular time, even for future dates 
				  "order": "date_start_asc"
				});
				console.log("getClientUpcmingBookings: " + this.clientBookings);
				resolve();
			});
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
		this.selectedSlotTime = slot ;
		this.loader = this.loadingCtrl.create({
			content: "Please Wait..."
		});
		this.loader.present().then(() => {
			// Your logic to load content
			console.log("hihere")
			console.log(slot);

			this.isValidDateAndTimeSelected = true;
			let date = this.calendar.date.getFullYear().toString() + "-" + (this.calendar.date.getMonth()+1).toString() + "-" +this.calendar.selectedDate.toString();
			console.log(date)
			this.simplyBookDateFormat = date;
			this.endTime = this.newClient.calculateEndTime(date + " " + this.selectedSlotTime, this.facility.service_id_in_simplybook, this.facility.service_provider_id_in_simplybook);
			this.endTime = this.endTime.split(" ")[1]
			let endTimeHH = this.endTime.split(":")[0]
			let endTimeMM = this.endTime.split(":")[1]
			this.endTime = endTimeHH+":"+endTimeMM;
			console.log(endTimeHH, endTimeMM);
			this.loader.dismiss();
		});

	}

	proceedBook(){
		console.log(this.calendar)
		let date = this.calendar.date.getFullYear().toString() + "-" + (this.calendar.date.getMonth()+1).toString() + "-" +this.calendar.selectedDate.toString();
		console.log("booking date" + date+" "+this.selectedSlotTime);
		// console.log(endTime)
		this.navController.push(BookingConfirmationPage, {
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
		});
	}
	

	dateSelected(day,month,year){
		this.loader = this.loadingCtrl.create({
			content: "Please wait..."
		});
		if (this.goToPreviousMonthFlag) this.isSelected = true;
		this.calendar.selectedDate = day;
		this.loader.present().then(() => {
		console.log(day + month + year);
		//this check is for avoiding selecting invalid or greyed out date
		
		this.dateSelectedString = day + " " + this.calendar.monthNames[month] + " " + year;
		if ((day < this.calendar.currentDate && this.goToPreviousMonthFlag) || day >= this.calendar.currentDate) {
			this.ruleEngineInstance.ruleEngineDriver(new Date(year, month, day));
			this.slotsArray = this.ruleEngineInstance.getSlotArray();
			if (this.slotsArray.length == 0) this.areSlotsAvailable = false;
			else this.areSlotsAvailable = true;
			console.log(new Date(year, month, day));
			console.log(this.slotsArray);
			this.loader.dismiss();
		}

	});
	}
}

export class ruleEngineFactory {

	private slotArray : Array<{timeValue: string, displayTimeValue: string, slotType: string}>;
	private slotArrayFromSimplyBook : any; 
	private ruleIdentifier : any;
	private ruleValue : any;
	private timeSlot : any;
	private workingHours : any;
	private serviceId : any;
	private serviceProviderId : any;
	public ruleS01 : any;
	public dateSelectedGlobal : any;

	constructor (private facility, private newClient, private clientBookings) {
		this.ruleIdentifier = this.facility.ruleNumber.split(",");
		this.ruleValue = this.facility.ruleValue.split(",");
		this.timeSlot = this.facility.timeSlot;
		this.workingHours = this.facility.openingHours.split("-");
		this.serviceId = this.facility.service_id_in_simplybook;
		this.serviceProviderId = this.facility.service_provider_id_in_simplybook;
		console.log(this.ruleIdentifier);
		console.log(this.ruleValue);
		let ruleS01index = this.ruleIdentifier.indexOf("S01");
		if (ruleS01index === -1) {
			this.ruleS01 = 60;
		}
		else {
			this.ruleS01 = this.ruleValue[ruleS01index];
		}
		
	}

	ruleEngineDriver(todayDate){
		this.getSlotsFromSimplyBook(todayDate);
		this.dateSelectedGlobal = todayDate;
		this.populateSlotArray();
		let ruleM02 = this.checkForUpcomingBooking();
		console.log("ruleEngineFactory: checkForUpcomingBooking: returnValue " + ruleM02);
		let ruleM01 = this.checkForMaxBookings();
		console.log("ruleEngineFactory: checkForMaxBookings: returnValue " + ruleM01);

		this.slotMaker(ruleM02, ruleM01);
	}

	slotMaker(ruleM02, ruleM01) {
		let flag = 0;
		let slotCounter = 0;
		this.slotArray.forEach(element => {
			console.log(element.timeValue);
			flag = 0;
			for (let i = 0; i < this.slotArrayFromSimplyBook.length; i=i+1){
				if (this.slotArrayFromSimplyBook[i].includes(element.timeValue) ){
					flag = 1;
					if (!(ruleM01 && ruleM02)) {
						element.slotType = "restrictedSlot";
					}
					else {
						element.slotType = "availableSlot";
					}
					break;
				}
			}
			if (flag === 0){
				element.slotType = "bookedSlot";
			}
			slotCounter = slotCounter + 1;
		});
		console.log(this.slotArray);
	}

	getSlotArray() {
		return this.slotArray;
	}

	getSlotsFromSimplyBook(dateSelected) {
		console.log("ruleEngineFactory: getSlotsFromSimplyBook: slotArrayFromSimplyBook: " + "Date for which slots are fetched: " + dateSelected);
		dateSelected = new Date (dateSelected.getFullYear(), dateSelected.getMonth(), dateSelected.getDate());
		console.log(dateSelected);
		let slots = this.newClient.getStartTimeMatrix(dateSelected, dateSelected, this.serviceId, this.serviceProviderId, 1);
		
		this.slotArrayFromSimplyBook = Object.getOwnPropertyDescriptor(slots,Object.keys(slots)[0]).value;
		console.log("ruleEngineFactory: getSlotsFromSimplyBook: slotArrayFromSimplyBook: " + this.slotArrayFromSimplyBook);
	}

	getBookingsForParticularFacility(upcomingOnly, monthlyOnly, isCurrentMonth) {
		let Bookings = [];
		let date = new Date();
		let epoch_today = date.getTime();
		
		this.clientBookings.forEach(booking => {
			if (+booking.event_id === this.serviceId) {
				if (upcomingOnly) {
					let bDateTime = booking.start_date.replace(" ", "T");//replacing with T to parse into epoch
					let bDate = Date.parse(bDateTime);
					if (bDate > epoch_today){
						Bookings.push(booking);	
					}
				}
				else if (monthlyOnly) {
					console.log(Object.keys(booking));
					console.log(Object.getOwnPropertyDescriptor(booking,Object.keys(booking)[11]));
					let bDateTime = booking.start_date.replace(" ", "T");
					let bDate = Date.parse(bDateTime);
					let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);//00:00 on first day of next month
					console.log(lastDay);
					let epoch_lastday = lastDay.getTime();
					if (bDate < epoch_lastday && new Date(bDate).getMonth() === this.dateSelectedGlobal.getMonth()) {
						Bookings.push(booking);
					}
					else if(bDate >= epoch_lastday && new Date(bDate).getMonth() === this.dateSelectedGlobal.getMonth()){
						Bookings.push(booking);
					}
				}
				else {
					Bookings.push(booking);
				}
				
			}
		});
		return Bookings;
	}

	//this method checks for rule M01 i.e maximum bookings in a month
	checkForMaxBookings() {
		let  maxBookingRuleIndex = this.ruleIdentifier.indexOf("M01");
		console.log("ruleEngineFactory: checkForMaxBookings: maxBookingRuleIndex: " + maxBookingRuleIndex);
		if (maxBookingRuleIndex != -1) {
			console.log("ruleEngineFactory: checkForMaxBookings: Info: Rule M01 is applicable");
			let isCurrentMonth;
			if (new Date().getMonth() === this.dateSelectedGlobal.getMonth()) isCurrentMonth = true;
			else isCurrentMonth = false;
			console.log("ruleEngineFactory: checkForMaxBookings: isCurrentMonth: " + isCurrentMonth);
			let totalBookings = this.getBookingsForParticularFacility(false,true, isCurrentMonth);
			console.log("ruleEngineFactory: checkForMaxBookings: totalBookings: " + totalBookings);
			if (totalBookings.length < this.ruleValue[maxBookingRuleIndex]) {
				return true; 
			}
			else if (totalBookings.length >= this.ruleValue[maxBookingRuleIndex]){
				return false;
			}
		}
		else {
			return true;
		}
	}

	//method to check if client has any upcoming booking. Returns false if the check if no effect on slots
	checkForUpcomingBooking() {
		let  upcomingBookingRuleIndex = this.ruleIdentifier.indexOf("M02");
		console.log("ruleEngineFactory: checkForUpcomingBooking: upcomingBookingRuleIndex: " + upcomingBookingRuleIndex);
		if (upcomingBookingRuleIndex != -1) {
			console.log("ruleEngineFactory: checkForUpcomingBooking: Info: Rule M02 is applicable");
			let upcomingBookings = this.getBookingsForParticularFacility(true,false,true);//3rd param here is dummy
			console.log("ruleEngineFactory: checkForUpcomingBooking: upcomingBookings: " + upcomingBookings);
			if (this.ruleValue[upcomingBookingRuleIndex] == "false") {
				return true; 
			}
			else if(upcomingBookings.length === 0 && this.ruleValue[upcomingBookingRuleIndex] == "true"){
				return true;
			}
			else {
				return false;
			}
		}
		else {
			return true;
		}
	}
	//method to create slots.
	populateSlotArray() {
		this.slotArray = [];
		let slotBreakIndex = this.ruleIdentifier.indexOf("S02");//get index of the rule Identifier in Array
		console.log("ruleEngineFactory: populateSlotArray: slotBreakIndex: " + slotBreakIndex);
		let slotBreakDuration;
		if (slotBreakIndex === -1) {
			slotBreakDuration = 0;
		}
		else {
			slotBreakDuration = +this.ruleValue[slotBreakIndex];//plus is prepended here to convert string to int
		}
		console.log("ruleEngineFactory: populateSlotArray: slotBreakDuration: " + slotBreakDuration);
		let startTime = +this.workingHours[0];
		let endTime = +this.workingHours[1];
		let time = new Date().getHours() + (new Date().getMinutes())/60;
		console.log("ruleEngineFactory: populateSlotArray: currentTime: " + time);
		console.log("ruleEngineFactory: populateSlotArray: startTime: " + startTime);
		console.log("ruleEngineFactory: populateSlotArray: endTime: " + endTime);

		for (let i = startTime; i < endTime; i=i+this.timeSlot+slotBreakDuration) {
			let mins = (i - Math.floor(i)) * 60;
			let finalTime = i + this.timeSlot;
			let displayTime;
			displayTime = this.getDisplayTime(i);
			console.log(displayTime);			
			let slotDisplayTime = displayTime + " - " + this.getDisplayTime(i+this.timeSlot);
			this.slotArray.push({timeValue: displayTime, displayTimeValue: slotDisplayTime, slotType: ""});
		}
		console.log("ruleEngineFactory: populateSlotArray: slotArray: " + this.slotArray);
	}

	getDisplayTime(time){
		let mins = (time - Math.floor(time)) * 60;
		let hour = Math.floor(time);
		let displayMins;
		let displayHours;
		if (mins < 10){
			displayMins = "0" + mins;
		}
		else {
			displayMins = mins;
		}

		if (hour < 10){
			displayHours = "0" + hour;
		}
		else{
			displayHours = hour;
		}
		let displayTime = displayHours + ":" + displayMins;
		return displayTime;
	}

}


