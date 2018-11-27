import { Component, ApplicationRef } from '@angular/core';
import { NavController, ToastController} from 'ionic-angular';
//import { Network } from '@ionic-native/network';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
//import { HttpClient } from '@angular/common/http';
import { SimplyBookClient } from '../../providers/simplybook/client';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  public societyName:any;
  public societyLogo:any;
  private login:FormGroup; 
  public appmodule:SimplyBookClient;
  constructor(public navCtrl: NavController, private appref: ApplicationRef, public http: Http, private formBuilder: FormBuilder, private alertCtrl: AlertController) {

    let url = "http://digitalsociety.pythonanywhere.com/getSocietyDetails?societyId=1";
    this.http.get(url).map(res => res.json()).subscribe(data => {
      this.societyName = data.displayName;
      this.societyLogo = data.logo;
    });
    this.login = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
    //alert(client);
    this.appmodule = new SimplyBookClient();
  }

  loginForm(){
    let userName = this.login.value.userName;
    let password = this.login.value.password;
    let invalidLoginCredsMessage = "Either the Email or Password provided was incorrect. Please try again.";
    let serverErrorMessage = "Unable to connect to Server. Please try later";
    console.log(userName+password);
    let clientinfo;
    clientinfo = this.appmodule.client.getClientInfoByLoginPassword(userName,password);
    console.log(clientinfo);
    if(clientinfo.code == -32065){
      this.invalidLoginAlert(invalidLoginCredsMessage);
    }
    /*else{
      this.invalidLoginAlert(serverErrorMessage);
    }*/
  }

  invalidLoginAlert(alertMessage: any){
    let invalidLoginAlert = this.alertCtrl.create({
      title: 'Login Failure',
      subTitle: alertMessage,
      buttons: ['Dismiss'],
    });

    invalidLoginAlert.present();
  }
}
