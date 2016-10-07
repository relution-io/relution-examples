import { Component } from '@angular/core';

/*
  Generated class for the TranslationDropdown component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'translation-dropdown',
  templateUrl: 'translation-dropdown.html'
})
export class TranslationDropdown {

  text: string;

  constructor() {
    console.log('Hello TranslationDropdown Component');
    this.text = 'Hello World';
  }

}
