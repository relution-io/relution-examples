import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import * as Relution from 'relution-sdk';
import 'rxjs/add/operator/map';
import * as Q from 'q';

/*
  Generated class for the Tasks provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Tasks {
  public collection: Relution.livedata.Collection;
  public model: Relution.livedata.Model;
  constructor() {
    const taskStore = new Relution.livedata.SyncStore({
      useLocalStore: true,
      useSocketNotify: true
    });
    class TaskModel extends Relution.livedata.Model {}
    class TaskCollection extends Relution.livedata.Collection {};
    TaskModel.prototype.idAttribute = '_id';
    TaskModel.prototype.entity = 'Task';
    TaskModel.prototype.urlRoot = Relution.web.resolveUrl('api/v1/tasks/');

    TaskCollection.prototype.url = Relution.web.resolveUrl('api/v1/tasks/');
    TaskCollection.prototype.model = TaskModel;
    TaskCollection.prototype.store = taskStore;
    this.collection = new TaskCollection();
  }

  fetch() {
    return this.collection.fetch(<any>{
      sortOrder: ['-dueTo']
    });
  }
}

