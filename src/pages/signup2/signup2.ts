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
import { SocietiesProvider } from '../../providers/society/society';
import { SignupPage } from '../signup/signup';
/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup2',
  templateUrl: 'signup2.html',
})
export class SignupPage2 {
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


    private societies: any = [];
    private selectedSociety: any = -1;
    private societiesInfo: any;
    private signUpSocietyForm: any;

    constructor(public societiesProvider: SocietiesProvider, public navCtrl: NavController, public navParams: NavParams, public http: Http, private formBuilder: FormBuilder, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private storage: Storage) {
      // console.log(('ionViewDidLoad SignupPage');

    }

    ngOnInit() {
      this.signUpSocietyForm = this.formBuilder.group({
        societySearch: ['', Validators.required],
        unitNo: ['', Validators.required],
        type: ['', Validators.required],
      });

      // Fetching static data
      this.loader = this.loadingCtrl.create({
        content: " Please wait..."
      });
      this.loader.present().then(() => {
        firebase.database().ref('societies').once('value', (snapshot) => {
          console.log(snapshot.val())
          this.societiesInfo = snapshot.val();

          for(let societyKey in this.societiesInfo) {
            console.log(this.societiesInfo[societyKey]);
            this.societies.push({
              id: this.societiesInfo[societyKey].society_id,
              name: this.societiesInfo[societyKey].display_name
            });
          }
          console.log(this.societies)
          this.loader.dismiss();
        });
      })
      
    }

    // For fetching the selected society in search society screen
    selectionChange(event: {
      component: IonicSelectableComponent,
      value: any 
    }) {
      console.log('selectedSociety:', event.value);
      this.selectedSociety = event.value;
    }

    loadMemberSignUpForm() {
      console.log(this.signUpSocietyForm.value)
      this.navCtrl.push(SignupPage, {
        societyInfo: this.signUpSocietyForm.value
      });
    }

}
