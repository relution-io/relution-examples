import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { DeviceGlobalization } from './device-globalization';

@Injectable()
export class Translation {

  public lang = DeviceGlobalization.preferredLanguage;

  constructor(public http: Http) {
    console.log('Hello Translation Provider');
  }

  public static de_DE = {
    'Login as:': 'Loggen Sie sich ein als:'
  };

  public static en_UK = {};

  public t(key, attributes?){

    if (!Translation[this.lang][key]) {
      return key;
    }

    if (attributes) {
      return Translation[this.lang][key](attributes);
    }

    return Translation[this.lang][key];
  }
}
