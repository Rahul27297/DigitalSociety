import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewcomplaintPage } from './newcomplaint';

@NgModule({
  declarations: [
    NewcomplaintPage,
  ],
  imports: [
    IonicPageModule.forChild(NewcomplaintPage),
  ],
})
export class NewcomplaintPageModule {}
