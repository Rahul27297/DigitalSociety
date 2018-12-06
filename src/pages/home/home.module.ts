import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { NoticesPage } from '../notices/notices';
@NgModule({
  declarations: [
    HomePage,
    NoticesPage,
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
  ],
})
export class HomePageModule {}
