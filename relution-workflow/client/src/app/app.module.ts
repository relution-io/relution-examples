import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { TabsPage } from '../pages/tabs/tabs';
import { Initial } from './../providers/initial';
import { StaticUsers } from './../providers/config';
import { StartPage } from './../pages/start/start';
import { DeviceGlobalization } from './../providers/device-globalization';
import { Translation } from './../providers/translation';
import { ApprovalList } from './../pages/approval-list/approval-list';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    TabsPage,
    StartPage,
    ApprovalList
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    TabsPage,
    StartPage,
    ApprovalList
  ],
  providers: [Initial, StaticUsers, DeviceGlobalization, Translation]
})
export class AppModule {}
