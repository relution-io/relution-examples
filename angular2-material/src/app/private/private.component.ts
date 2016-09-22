import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.scss'],
  providers: [AuthenticationService]
})
export class PrivateComponent implements OnInit {

  constructor(private _service: AuthenticationService, private _router: Router) { }

  ngOnInit() {
    if(!this._service.getAuthorization()) {
      this._router.navigate(['login']);
    }
  }

  logout() {
    this._service.logout()
      .then(() => {
        this._router.navigate(['login']);
      });
  }

}
