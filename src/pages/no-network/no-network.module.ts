import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NoNetworkPage } from './no-network';

@NgModule({
  declarations: [
    NoNetworkPage,
  ],
  imports: [
    IonicPageModule.forChild(NoNetworkPage),
  ],
})
export class NoNetworkPageModule {}
