import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SimplyBookClient } from '../../providers/simplybook/client';
import { Http } from '@angular/http';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular'
import { LoginPage } from '../login/login';
/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
    public societyName: any;
    public societyLogo: any;
    private login: FormGroup;
    private simplyBookAdmin: SimplyBookClient;
    private loader: any;
    private userName: any;
    private Name: any;
    private flatNumber: any;
    private contactNumber: any;
    private oneTimeCode: any;
    private Password: any;
    private rePassword: any;
    private visibility: any = "none";
    private client: any;
    private clientObject: any;
    private disableFields: any = "no";
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, private formBuilder: FormBuilder, private loadingCtrl: LoadingController, private alertCtrl: AlertController) {
    console.log('ionViewDidLoad SignupPage');
    this.loader = this.loadingCtrl.create({
      content: " Please wait..."
    });
    this.loader.present();
    let url = "http://digitalsociety.pythonanywhere.com/getSocietyDetails?societyId=1";
    this.http.get(url).map(res => res.json()).subscribe(data => {
      this.societyName = data.displayName;
      this.societyLogo = data.logo;
    });
    this.login = this.formBuilder.group({
      userName: ['', Validators.required],
      oneTimeCode: ['', Validators.required],
      flatNumber: ['', Validators.required]
    });
  }

  displayLoader(param){
    this.loader = this.loadingCtrl.create({
      content: " Please wait..."
    });
    this.loader.present();
    if(param === "otp"){
      setTimeout(() => {
        this.verifyOtp();
      }, 500);
    }
    else{

    setTimeout(() => {
      this.signUp();
    }, 500);
  }
  }

  verifyOtp(){
    this.userName = this.login.value.userName;
    this.oneTimeCode = "+91" + this.login.value.oneTimeCode;
    this.flatNumber = this.login.value.flatNumber;
    this.client = this.simplyBookAdmin.admin.getClientList(this.userName,1);
    
    console.log(this.client);
    if(this.client.length === 0){
      this.alertCtrl.create({
        title: "The entered Email is not associated with Sankul Society",
        buttons: ['Dismiss']
      }).present();
      this.loader.dismiss();
    }
    else{
      let clientId = this.client[0].id;
      this.clientObject = this.simplyBookAdmin.admin.getClient(parseInt(clientId));
      console.log(this.clientObject);
      if(this.userName === this.clientObject.email && this.flatNumber === this.clientObject.address1 && this.oneTimeCode === this.clientObject.phone){
      this.loader.dismiss();
      this.alertCtrl.create({
        title: "OTP verified successfully. Please fill in further entries.",
        buttons: ['Dismiss']
      }).present();
      this.visibility = "visible";
      this.disableFields = "yes";
      this.login = this.formBuilder.group({
        Password: ['', Validators.required],
        rePassword: ['', Validators.required],
        Name: ['', Validators.required]
      });
    }
    else{
      this.loader.dismiss();
      this.alertCtrl.create({
        title: "The entered Email/Flat Number/OTP do not match",
        buttons: ['Dismiss']
      }).present();
      
    }
    }
    
  }

  signUp(){
    //this.userName = this.login.value.userName;
    this.Name = this.login.value.Name;
    //this.contactNumber = "+91" + this.login.value.contactNumber;
    //this.flatNumber = this.login.value.flatNumber;
    //this.oneTimeCode = this.login.value.oneTimeCode;
    this.Password = this.login.value.Password;
    this.rePassword = this.login.value.rePassword;
    if(this.rePassword === this.Password){
      let client = this.simplyBookAdmin.admin.getClientList(this.userName,1);
        if(this.Name === this.clientObject.name){
          this.simplyBookAdmin.admin.changeClientPassword(parseInt(this.client[0].id), this.Password, false);
          this.loader.dismiss();
          this.alertCtrl.create({
            title: "Signed Up Succesfully!. Please Login to continue",
            buttons: ['Ok']
          }).present();
          this.navCtrl.pop();
        }
        else{
          this.alertCtrl.create({
            title: "The entered details for one or more fields donot match with those registered with Sankul Society",
            subTitle: "If this issue persists please contact Sankul Administration",
            buttons: ['Dismiss']
          }).present();
          this.loader.dismiss();
        }
    }
    else{
      this.loader.dismiss();
      this.alertCtrl.create({
        title: "The password values do not match",
        buttons: ['Dismiss']
      }).present();
    }
    console.log(this.userName);
  }

  ionViewDidEnter(){
    this.simplyBookAdmin = new SimplyBookClient();
    this.loader.dismiss();
  }

  ionViewDidLoad() {
    
  }

  loadLoginPage(){
    this.navCtrl.pop();
  }

}
