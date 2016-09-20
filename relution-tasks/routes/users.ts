import * as express from 'express';

const security = require('relution/security.js');

export function init(app: express.Application) {
  app.get('/api/v1/users/me', function getUser(req: express.Request, res: express.Response, next: express.NextFunction) {
    res.json(security.getCurrentUser());
  });

  app.get('/api/v1/users/:name', function getUser(req: express.Request, res: express.Response, next: express.NextFunction) {
    res.json(security.getUserByName(req.param['name']));
  });

  app.get('/api/v1/users', function getUsers(req: express.Request, res: express.Response, next: express.NextFunction) {
    res.json(security.getUsersByExample(req.query, 'name', 'uuid', 'surname'));
  });
}
