import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
// import * as Relution from 'relution-sdk';

@Injectable()
export class Initial {

  constructor(public http: Http) {
    // console.log(Relution);
    // debugger;
    // Relution.init({
    //   serverUrl: 'http://192.168.99.100:8080',
    //   debug: true,
    //   application: 'workflow'
    // }).then(info => console.log(info));
  }

}
