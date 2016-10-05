/**
 * @file app.js
 */
import * as express from 'express';
import * as bodyParser from 'body-parser';
import {init as routesRoute} from './routes/routes';
import {init as pushRoute} from './routes/push';
import {init as connectorsRoute} from './routes/connectors';
const approvalRoute = require('./routes/approvals');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// global variables
global['app'] = app;
// install routes
routesRoute(app);
pushRoute(app);
connectorsRoute(app);
approvalRoute.approvals(app);
// start express server
app.listen(app.get('port'));
