import {Credentials} from 'relution-sdk/lib/security/auth';
import { Component, Input} from '@angular/core';
import {NavController, LoadingController, AlertController} from 'ionic-angular';
import { NgForm } from '@angular/common';
import {HomePage} from '../home/home';
import * as Relution from 'relution-sdk';
const prod = {userName: 'mutaboradmin', password: 'mway1234'};

@Component({
  templateUrl: 'build/pages/login/login.html'
})
export class LoginPage {
  public credentials = prod;
  constructor(private nav: NavController, private loadingCtrl: LoadingController, private alertCtrl: AlertController) {}

  onSubmit() {
    const loading = this.loadingCtrl.create({
      content: '<span class="loading-context">Loading ...</span>'
    });
    loading.present();
    // login on  the Relution server

    return Relution.web.login(
      {
        userName: this.credentials.userName,
        password: this.credentials.password
      },
      {
        offlineCapable: true // there are more options available checkout : https://relution-io.github.io/relution-sdk/interfaces/_core_init_.initoptions.html
      }
    )
    .then((resp) => {
      // go to the tab page
      this.credentials.userName = "";
      this.credentials.password = "";
      this.nav.setRoot(HomePage)
        .then(() => {
          loading.dismiss();
        })
        .catch(loading.dismiss);
    })
    .catch((e: Relution.web.HttpError) => { // checkout https://relution-io.github.io/relution-sdk/interfaces/_web_http_.httperror.html
      loading.dismiss();
      loading.onDidDismiss(() => {
         const alert = this.alertCtrl.create({
          title: `${e.name} ${e.statusCode}`,
          subTitle: e.message,
          buttons: ['OK']
        });
        alert.present();
      });
    });
  }
}
