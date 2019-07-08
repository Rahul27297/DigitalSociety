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
    // public societyName: any;
    // public societyLogo: any;
    // private login: FormGroup;
    // private simplyBookAdmin: SimplyBookClient;
    // private userName: any;
    // private Name: any;
    // private flatNumber: any;
    // private contactNumber: any;
    // private oneTimeCode: any;
    // private Password: any;
    // private rePassword: any;
    // private visibility: any = "none";
    // private client: any;
    // private clientObject: any;
    // private disableFields: any = "no";

    private loader: any;

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

    private Errors = {
      passwordsNotMatchFlag: false,
      passwordLengthTooShort: false,
      emailIdAlreadyExists: false
    }
    private isFormValid: any = false;

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
      this.signUpMemberForm = this.formBuilder.group({
        name: ['', Validators.required],
        phoneNo: ['', Validators.required],
        member_email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      });    
    }

    Validations() {
      this.isFormValid = false;
      this.Errors.passwordsNotMatchFlag = false;
      this.Errors.passwordLengthTooShort = false;
      this.Errors.emailIdAlreadyExists = false;


      console.log(this.signUpMemberForm.value.password);
      for(let i in this.Errors) {
        this.Errors[i] = false
      }

      // validation # 1 for entered password = confirm password
      if(this.signUpMemberForm.value.password != this.signUpMemberForm.value.confirmPassword) {
        this.Errors.passwordsNotMatchFlag = true;
      }

      // validation # 2 for password length greater than or eual to 6
      if(this.signUpMemberForm.value.password.length < 6) {
        this.Errors.passwordLengthTooShort = true;
      }

      // validation # 3 email ID already exists (Keep this rule as last rule because it has asynch check 
      // of already present email ID in firebase)

      // Also it calls this.addRequestInFirebase(); which adds actual user in firebase after all validations
      let loader = this.loadingCtrl.create({
        content: "Please wait..."
      });
      loader.present().then(() => {
        firebase.database().ref('members').orderByChild('member_email').equalTo(this.signUpMemberForm.value.member_email).once('value',(snapshot) => {
          
          // If user is present in firebase it'll not return null
          console.log(snapshot.val());
          if(snapshot.val() != null) {
            this.Errors.emailIdAlreadyExists = true;
          }
          // Check if there is no validation error
          console.log(this.Errors)
          for(let i in this.Errors) {
            if(this.Errors[i] == true) {
              this.isFormValid = false;
              loader.dismiss();
              return;
            }
          }

          // No errors an
          this.isFormValid = true;

          if(this.isFormValid) {
            console.log(this.signUpMemberForm.value);
            this.memberDataModel.name = this.signUpMemberForm.value.name;
            this.memberDataModel.phone = this.signUpMemberForm.value.phoneNo;
            this.memberDataModel.member_email = this.signUpMemberForm.value.member_email;
            console.log(this.memberDataModel)
    
    
            this.addRequestInFirebase();
          }

          loader.dismiss();
        });

      });



    }

    submitRequest() {
      this.Validations();
      console.log(this.isFormValid)
    }

    addRequestInFirebase() {
      let loader = this.loadingCtrl.create({
        content: "Please wait..."
      });
      loader.present().then(() => {
        firebase.database().ref('requests/').push(this.memberDataModel)
        .then(() => {

          firebase.database().ref('members/').push(this.memberDataModel)
          .then(() => {
            console.log("request and member added");
  
            firebase.auth().createUserWithEmailAndPassword(this.memberDataModel.member_email, this.signUpMemberForm.value.password)
            
            .then((user) => {
              console.log(user, " Created successfully!");
              loader.dismiss();
            })
            
            .catch((error) => {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              console.log(errorMessage);
              loader.dismiss();
              // ...
            });
  
          })
          .catch((error) => {
            console.log(error)
            loader.dismiss();
          })

        })
        .catch((error) => {
          console.log(error);
          loader.dismiss();
        })
      });
      // Add request in requests collection


    }

 
}
