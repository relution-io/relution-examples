import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Globalization } from 'ionic-native';
/*
  Get the i18n language
*/
@Injectable()
export class DeviceGlobalization {
  public preferredLanguage = 'de';

  constructor(public platform: Platform) {
    if (platform.is('mobile')) {
      Globalization.getPreferredLanguage()
        .then((lang) => {
          this.preferredLanguage = lang.value;
          console.log('Hello DeviceGlobalization Provider');
          console.log(lang);
        })
        .catch(e => console.error(e));
    }
  }
}
