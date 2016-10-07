import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { StaticUsers } from './../../providers/config';
import { TabsPage } from './../tabs/tabs';
// import {login} from './../../../node_modules/relution-sdk/lib/web/http';

@Component({
  templateUrl: 'start.html',
})
export class StartPage {
  private _staticUsers: Array<any>;

  constructor(private navCtrl: NavController, private service: StaticUsers) {
    this.staticUsers = this.service.users;
  }

  public get staticUsers(): Array<any> {
    return this._staticUsers;
  };

  public set staticUsers(value: Array<any>) {
    this._staticUsers = value;
  };

  public authenticate(username: String) {
    const user: Array<{password: String, username: String}> = this.staticUsers.filter((user) => {
      return user.username === username;
    });
    this.navCtrl.push(TabsPage);
    // login({
    //   username: user[0].username,
    //   password: user[0].password
    // })
    //   .then((resp) => {
    //     console.log(resp);
    //   });
    console.log(user[0]);
  }
}
