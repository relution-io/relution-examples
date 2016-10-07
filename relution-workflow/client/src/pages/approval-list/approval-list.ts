import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Approval } from './../../providers/approval';
import {LoadingController} from 'ionic-angular';
/*
  the Start screen for the Approval app Screen
*/
@Component({
  selector: 'page-approval-list',
  templateUrl: 'approval-list.html',
  providers: [Approval]
})
export class ApprovalList {
  public collection: Array<any>;

  constructor(public navCtrl: NavController, private loadingCtrl: LoadingController, public approvalService: Approval) {

  }

  ionViewDidLoad() {
    const loading = this.loadingCtrl.create({
      content: '<img src="assets/img/bg.gif" />',
      spinner: 'hide'
    });
    loading.present();

    this.approvalService.fetch()
    .subscribe(
      () => {
        this.collection = this.approvalService.collection;
        console.log('Hello ApprovalList Page', this.collection);
        loading.dismiss();
      },
      e => {
        console.error(e);
        loading.dismiss();
      }
    );
  }
}
