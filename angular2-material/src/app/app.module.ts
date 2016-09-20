import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { MdCoreModule } from '@angular2-material/core'
import { MdInputModule } from '@angular2-material/input'
import { MdButtonModule } from '@angular2-material/button';
import { MdCardModule } from '@angular2-material/card';
import { MdRadioModule } from '@angular2-material/radio';
import { MdCheckboxModule } from '@angular2-material/checkbox'
import { MdTooltipModule } from '@angular2-material/tooltip';
import { MdSliderModule } from '@angular2-material/slider';
import { MdToolbarModule } from '@angular2-material/toolbar';
import { MdIconModule, MdIconRegistry } from '@angular2-material/icon';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { PrivateComponent } from './private/private.component';
import { LoggedInGuard } from './logged-in-guard';
import { AuthenticationService } from './authentication.service';
import { routes } from './app.routing';

import 'hammerjs';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent, LoginComponent, PrivateComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MdCoreModule.forRoot(), MdCardModule.forRoot(), MdButtonModule.forRoot(), MdRadioModule.forRoot(),
    MdCheckboxModule.forRoot(), MdTooltipModule.forRoot(), MdSliderModule.forRoot(), MdIconModule.forRoot(),
    MdToolbarModule.forRoot(), MdInputModule.forRoot(), RouterModule.forRoot(routes)
  ],
  providers: [AuthenticationService, LoggedInGuard]
})
export class AppModule {
  constructor(mdIconRegistry: MdIconRegistry) {
    mdIconRegistry.registerFontClassAlias('fontawesome', 'fa');
  }
}
