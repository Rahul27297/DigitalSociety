import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BookingConfirmationPage } from './booking-confirmation';

@NgModule({
  declarations: [
    BookingConfirmationPage,
  ],
  imports: [
    IonicPageModule.forChild(BookingConfirmationPage),
  ],
})
export class BookingConfirmationPageModule {}
