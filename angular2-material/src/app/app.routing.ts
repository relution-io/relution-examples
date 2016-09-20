import { ModuleWithProviders } from '@angular/core';

import { LoginComponent }  from './login/login.component';
import { PrivateComponent }    from './private/private.component';
import { LoggedInGuard } from './logged-in-guard';

export const routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: PrivateComponent /*, canActivate: [LoggedInGuard] */ },
];