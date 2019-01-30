import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';
import { Keyboard } from '@ionic-native/keyboard';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { SimplyBookClient } from '../../providers/simplybook/client';
import { AlertController } from 'ionic-angular'
import { ToastController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { LoadingController } from 'ionic-angular';
import { SignupPage } from '../signup/signup';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  public societyName: any;
  public societyLogo: any;
  private login: FormGroup;
  public appmodule: SimplyBookClient;
  private clientinfo: any;
  private loader: any;
  private societyId: any;
  private societyReady: boolean;
  constructor(public navCtrl: NavController, private toastCtrl: ToastController, private storage: Storage, public http: Http, private formBuilder: FormBuilder, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private keyboard: Keyboard) {
    //this.keyboard.disableScroll(true);
    //this.societyId = this.storage.get("societyId");
    /*let url = "http://digitalsociety.pythonanywhere.com/getSocietyDetails?societyId=1";
    this.http.get(url).map(res => res.json()).subscribe(data => {
      this.societyName = data.displayName;
      this.societyLogo = data.logo;
    });*/
    this.societyReady = false;
    this.societyName = "GULLY";
    this.login = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.appmodule = new SimplyBookClient();
  }

  displayLoader() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
    setTimeout(() => {
      this.loginForm();
    }, 1000);
  }


  loginForm() {
    let userName = this.login.value.userName;
    let password = this.login.value.password;
    let invalidLoginCredsMessage = "Either the Email or Password provided was incorrect. Please try again.";
    //let serverErrorMessage = "Unable to connect to Server. Please try later";
    this.clientinfo = this.appmodule.client.getClientInfoByLoginPassword(userName, password);
    if (this.clientinfo.code == -32065) {
      this.loader.dismiss();
      this.invalidLoginAlert(invalidLoginCredsMessage);
    }
    else {//login considered successful --> Server can be down, this case has not been considered here
      let url = "https://upgraded-server.herokuapp.com/getMemberSocietyIdByMemberEmail?member_email=" + userName;
      this.http.get(url).map(res => res.json()).subscribe(data => {
        //need error handling here for api
        let success = Object.getOwnPropertyDescriptor(data, "flag").value;
        if (success) {
          this.societyId = Object.getOwnPropertyDescriptor(data, "society_id").value;
          this.storage.set("societyId", this.societyId);
          url = "https://upgraded-server.herokuapp.com/getSocietyBySocietyId?society_id=" + this.societyId;
          this.http.get(url).map(res => res.json()).subscribe((val) => {
            this.storage.set("societyInfo", val).then(() => {
              this.storage.set('Password', password);
              this.loader.dismiss();
              this.toastCtrl.create({
                message: 'Login Successful',
                duration: 2000,
                position: 'bottom'
              }).present();
              this.storage.set('Info', this.clientinfo);
              this.storage.get('societyInfo').then((val) => {
                this.navCtrl.setRoot(HomePage, {
                  societyInfo: val
                });
              })
            });
          });
        }
      });


    }
    /*else{
      this.invalidLoginAlert(serverErrorMessage);
    }*/
  }

  invalidLoginAlert(alertMessage: any) {
    let invalidLoginAlert = this.alertCtrl.create({
      title: 'Login Failure',
      subTitle: alertMessage,
      buttons: ['Dismiss'],
    });
    invalidLoginAlert.present();
  }

  loadSignupPage() {
    this.navCtrl.push(SignupPage);
  }


}
