import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { StartPage } from '../pages/start/start';

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = StartPage;
  constructor(platform: Platform) {
    platform.ready().then(() => {
      StatusBar.styleBlackOpaque();
    });
  }
}
