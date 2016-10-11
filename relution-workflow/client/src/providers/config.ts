import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
// import * as Relution from 'relution-sdk';
// import { init } from './../../node_modules/relution-sdk/lib/core/';
import {Relution} from 'init-pack';
const ICON_PATH = 'assets/icon/';

@Injectable()
export class StaticUsers {

  public users = [
    {
      password: 'test12345',
      username: 'PEOPLE1',
      icon: `${ICON_PATH}girl.svg`
    },
    {
      password: 'test12345',
      username: 'PEOPLE2',
      icon: `${ICON_PATH}man.svg`
    },
    {
      password: 'test12345',
      username: 'MANAGER1',
      icon: `${ICON_PATH}businessman.svg`
    }
  ];

  constructor(){
    Relution.init({
      serverUrl: 'http://192.168.99.100:8080',
      application: 'workflow-app'
    });
  }
}
