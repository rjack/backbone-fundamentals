
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

var recipes = [];

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/recipes/:id', function (req, res) {
    var recipe = recipes[req.params.id];
    res.send(recipe);
});

app.get('/recipes', function (req, res) {
    res.send(recipes);
});

app.post('/recipes', function (req, res) {
    var recipe  = req.body;
    recipe.id = recipes.length;
    recipes.push(recipe);
    res.send(recipe);
});

app.put('/recipes/:id', function (req, res) {
    var i, id = req.params.id,
        attrs = req.body,
        recipe = recipes[id],
        response = {};

    for (i in attrs) {
        if (recipe[i] !== attrs[i]) {
            recipe[i] = attrs[i];
            response[i] = attrs[i];
        }
    }
    res.send(response);
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
