import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
/*
  Generated class for the ToastsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.

  Use this class to generator toasts and display them.
  Currently, only text message and duration can be supplied.
*/


@Injectable()
export class ToastsProvider {

  //constructor cannot be overloaded in Angular. 
  //Hence a default implementation is provided where constructor will also be displayed in bottom
  constructor(private toastCtrl: ToastController, private message: string, private duration: number) {
    this.toastCtrl.create({
      message: this.message,
      duration: this.duration,
    }).present();
  }

  show(message, duration){
    
  }

}
