import { Component } from '@angular/core';
import { ionicBootstrap, Platform } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import * as Relution from 'relution-sdk';
import { LoginPage } from './pages/login/login';
import {enableProdMode} from '@angular/core';
enableProdMode();

const mway = 'https://mway.relution.io';
const local = 'https://pbrewing.mwaysolutions.com';
const home = 'http://10.21.4.52:8080/';

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class RelutionTasksApp {
  rootPage: any = LoginPage;

  constructor(public platform: Platform) {
    // initialized the Relution SDK
    Relution.init({
      serverUrl: local,
      debug: true,
      application: 'relution-tasks'
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}

ionicBootstrap(RelutionTasksApp);
