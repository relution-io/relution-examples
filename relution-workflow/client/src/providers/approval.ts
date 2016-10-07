import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/from';
import {Observable, Observer} from 'rxjs';


function auth(value: boolean) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      const isLoggedIn = value;
      if (!isLoggedIn) {
        throw new Error('Unauthorized');
      }
    };
}
/*
  The Collection Approval
*/
@Injectable()
export class Approval {
  public collection: Array<any> = [];
  public isLoggedIn = false;

  constructor(public http: Http) {
    console.log('Hello Approval Provider');
  }

  // @auth(true)
  public fetch(): any {
    return Observable.create((ob: Observer<any>) => {
      return this.http.get('assets/json/sample.json')
        .map((res: Response) => res.json())
        .subscribe(
          (collection) => {
            this.collection = collection;
            console.log(this.collection);
            ob.next(this.collection);
          }
        );
    });
  }
  // @auth(true)
  public byId(id: String){
    return this.collection.filter((model) => {
      return model.id === id;
    });
  }
}
