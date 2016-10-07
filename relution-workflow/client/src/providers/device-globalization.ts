import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Globalization } from 'ionic-native';
/*
  Get the i18n language
*/
@Injectable()
export class DeviceGlobalization {
  public static preferredLanguage = 'de_DE';

  constructor(public platform: Platform) {
    if (platform.is('mobile')) {
      Globalization.getPreferredLanguage()
        .then((lang) => {
          DeviceGlobalization.preferredLanguage = lang.value === 'de_DE' ? lang.value : 'en_UK';
          console.log('Hello DeviceGlobalization Provider');
          console.log(lang);
        })
        .catch(e => console.error(e));
    }
  }
}
