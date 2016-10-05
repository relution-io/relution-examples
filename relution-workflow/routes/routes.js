"use strict";
/**
* @file routes.ts
*/
var about = require('../package.json');
function init(app) {
    app.get('/index.json', 
    /**
    * provides an overview of available API, state, etc.
    *
    * @param req unused.
    * @param res body is an informal JSON that can be used for health monitoring, for example.
    * @return {*} unspecified value.
    */
    function getRoutes(req, res) {
        var index = {
            name: about.name,
            version: about.version,
            description: about.description,
            routes: app.routes
        };
        return res.json(index);
    });
}
exports.init = init;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicm91dGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7RUFFRTtBQUNGLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBRXpDLGNBQXFCLEdBQVE7SUFDM0IsR0FBRyxDQUFDLEdBQUcsQ0FBQyxhQUFhO0lBQ25COzs7Ozs7TUFNRTtJQUNGLG1CQUFtQixHQUFRLEVBQUUsR0FBUTtRQUNuQyxJQUFNLEtBQUssR0FBRztZQUNaLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtZQUNoQixPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU87WUFDdEIsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO1lBQzlCLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTTtTQUNuQixDQUFDO1FBQ0YsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDM0IsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBbEJlLFlBQUksT0FrQm5CLENBQUEifQ==