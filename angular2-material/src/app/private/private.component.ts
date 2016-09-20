import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.scss'],
  providers: [AuthenticationService]
})
export class PrivateComponent {

  constructor(private _service: AuthenticationService, private _router: Router) { }

  logout() {
    this._service.logout()
      .then(() => {
        this._router.navigate(['login']);
      });
  }

}
