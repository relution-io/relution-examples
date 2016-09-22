/* tslint:disable:no-unused-variable */

import { addProviders, async, inject } from '@angular/core/testing';
import {LoggedInGuard} from './logged-in-guard';

describe('LoggedInGuard', () => {
  it('should create an instance', () => {
    expect(new LoggedInGuard()).toBeTruthy();
  });
});
