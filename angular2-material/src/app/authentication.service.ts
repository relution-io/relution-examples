import { Injectable } from '@angular/core';
import { Credentials } from 'relution-sdk/lib/security/auth';
import * as Relution from 'relution-sdk';

const mway = 'https://mway.relution.io';

export class User {
  constructor(public userName, public password) { }
}

@Injectable()
export class AuthenticationService {

  constructor() { 
    Relution.init({
      serverUrl: mway,
      debug: false,
      application: 'audi-xpass'
    });
  }

  logout() {
    return Relution.web.logout()
    .catch((e: Relution.web.HttpError) => {
        console.log(e);
      });
  }

  login(user: User) {
    return Relution.web.login(
      {
        userName: user.userName,
        password: user.password
      }
    ).catch((e: Relution.web.HttpError) => {
      console.log(e);
    });
  }

  getAuthorization() {
    let o = Relution.security.getCurrentUser();
    if (o !== null || o != undefined) {
      return true;
    } else {
      return false;
    }
  }
}
