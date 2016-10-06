"use strict";
/**
 * @file app.js
 */
var express = require('express');
var bodyParser = require('body-parser');
var routes_1 = require('./routes/routes');
var push_1 = require('./routes/push');
var connectors_1 = require('./routes/connectors');
var approvals_1 = require('./routes/approvals');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// global variables
global['app'] = app;
// install routes
routes_1.init(app);
push_1.init(app);
connectors_1.init(app);
approvals_1.init(app);
// start express server
app.listen(app.get('port'));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7R0FFRztBQUNILElBQVksT0FBTyxXQUFNLFNBQVMsQ0FBQyxDQUFBO0FBQ25DLElBQVksVUFBVSxXQUFNLGFBQWEsQ0FBQyxDQUFBO0FBQzFDLHVCQUFrQyxpQkFBaUIsQ0FBQyxDQUFBO0FBQ3BELHFCQUFnQyxlQUFlLENBQUMsQ0FBQTtBQUNoRCwyQkFBc0MscUJBQXFCLENBQUMsQ0FBQTtBQUM1RCwwQkFBb0Msb0JBQW9CLENBQUMsQ0FBQTtBQUV6RCxJQUFNLEdBQUcsR0FBRyxPQUFPLEVBQUUsQ0FBQztBQUN0QixHQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzNCLEdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFFbkQsbUJBQW1CO0FBQ25CLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUM7QUFFcEIsaUJBQWlCO0FBQ2pCLGFBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNqQixXQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDZixpQkFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3JCLGdCQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbkIsdUJBQXVCO0FBQ3ZCLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDIn0=