import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class LoggedInGuard implements CanActivate {
    constructor(private _service: AuthenticationService) { }

    canActivate() {
        return this._service.getAuthorization();
    }

}