import { Component } from '@angular/core';
import { AuthenticationService, User } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public user: User;
  public form = {
    user: '',
    password: ''
  }
  constructor(private _service: AuthenticationService, private _router: Router) { 
    this.user = new User('', '');
  }

  onSubmit() {
    this._service.login(this.user).then((res) => {
      console.log(res);
      if (res) {
        this._router.navigate(['home']);
      } else {
        console.log("Login error.");
      }
    });
  }

}
