import {Tabs} from 'ionic-angular/components/tabs/tabs';
import {TabsPage} from '../tabs/tabs';
import {Tasks} from '../../providers/tasks/tasks';
import { Component, ViewChild } from '@angular/core';
import * as Relution from 'relution-sdk';
import * as Q from 'q';
import {NavController, LoadingController, AlertController} from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/home/home.html',
  providers: [Tasks]
})

export class HomePage {
  public user: Relution.security.User;
  public models: Array<Relution.livedata.Model> = [];

  constructor(private navCtrl: NavController, private loadingCtrl: LoadingController, private alertCtrl: AlertController, public tasks: Tasks) {
    this.user = Relution.security.getCurrentUser();
    const loading = this.loadingCtrl.create({
      content: '<span class="loading-context">Loading ...</span>'
    });
    loading.present();
    // const model = new this.tasks.collection.model();
    Q(this.tasks.fetch())
      .then(() => {
        loading.dismiss();
        this.models = this.tasks.collection.models;
      })
      .catch((e: Relution.web.HttpError) => { // checkout https://relution-io.github.io/relution-sdk/interfaces/_web_http_.httperror.html
        loading.dismiss();
      });
  }

  addNewModel(title: string, description) {
    const model = new this.tasks.collection.model();
    model.set('title', title);
    model.set('description', description);
    Q(model.save())
      .then((model) => {
        this.models = [];
        return Q(this.tasks.fetch());
      })
      .then((data) => {
        console.log('done', data);
        setTimeout(() => {
          this.models = this.tasks.collection.models;
          console.log(this.tasks.collection.models);
        }, 5000);//what is love

      })
      .catch((e) => {
        console.log(e);
      });
  }

  addNew() {
    let prompt = this.alertCtrl.create({
      title: 'New Task',
      cssClass: 'onyx',
      message: 'Enter a title for your Task',
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
        {
          name: 'description',
          placeholder: 'Description'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            return this.addNewModel(data.title, data.description);
          }
        }
      ]
    });
    prompt.present();
  }
}
