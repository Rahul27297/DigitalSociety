import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SimplyBookClient } from '../../providers/simplybook/client';
import { Http } from '@angular/http';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular'
import { Storage } from '@ionic/storage';
import { LoginPage } from '../login/login';
import * as firebase from 'firebase';
import { IonicSelectableComponent } from 'ionic-selectable';

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
class Port {
  public id: number;
  public name: string;
}
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

  
    private signUpMemberForm: any;
    private memberDataModel:any = {
      society_id: null,
      type: null,
      unit_no: null,
      member_email: null,
      name: null,
      phone: null,
      is_approved: false
    };

    private passwordErrors = {
      passwordsNotMatchFlag: false,
      passwordLengthTooShort: false
    }
    private isPasswordValid: any = false;

    constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, private formBuilder: FormBuilder, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private storage: Storage) {
      console.log(this.navParams.data.societyInfo);
      this.memberDataModel.society_id = this.navParams.data.societyInfo.societySearch.id;
      this.memberDataModel.type = this.navParams.data.societyInfo.type;
      this.memberDataModel.unit_no = this.navParams.data.societyInfo.unitNo;
    }
    portChange(event: {
      component: IonicSelectableComponent,
      value: any 
    }) {
      console.log('port:', event.value);
    }

    ngOnInit() {
      // this.loader = this.loadingCtrl.create({
      //   content: " Please wait..."
      // });
      // this.loader.present();
      this.signUpMemberForm = this.formBuilder.group({
        name: ['', Validators.required],
        phoneNo: ['', Validators.required],
        member_email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      });    
    }

    passwordValidations() {
      this.isPasswordValid = false;
      console.log(this.signUpMemberForm.value.password);
      for(let i in this.passwordErrors) {
        this.passwordErrors[i] = false
      }

      // validation # 1 for entered password = confirm password
      if(this.signUpMemberForm.value.password != this.signUpMemberForm.value.confirmPassword) {
        this.passwordErrors.passwordsNotMatchFlag = true;
      }

      // validation # 2 for password length greater than or eual to 6
      if(this.signUpMemberForm.value.password.length < 6) {
        this.passwordErrors.passwordLengthTooShort = true;
      }


      for(let i in this.passwordErrors) {
        if(this.passwordErrors[i] == true) {
          this.isPasswordValid = false;
          return;
        }
      }

      this.isPasswordValid = true;

    }

    submitRequest() {
      this.passwordValidations();
      console.log(this.isPasswordValid)
      if(this.isPasswordValid) {
        console.log(this.signUpMemberForm.value);
        this.memberDataModel.name = this.signUpMemberForm.value.name;
        this.memberDataModel.phone = this.signUpMemberForm.value.phoneNo;
        this.memberDataModel.member_email = this.signUpMemberForm.value.member_email;
        console.log(this.memberDataModel)
        this.addRequestInFirebase();
      }

    }

    addRequestInFirebase() {
      // Add request in requests collection
      firebase.database().ref('requests/').push(this.memberDataModel).then(() => {

        firebase.database().ref('members/').push(this.memberDataModel).then(() => {
          console.log("request and member added");

          firebase.auth().createUserWithEmailAndPassword(this.memberDataModel.member_email, this.signUpMemberForm.value.password)
          
          .then((user) => {
            console.log(user, " Created successfully!");
            
          })
          
          .catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
            // ...
          });

        })

      })
    }

 
}
