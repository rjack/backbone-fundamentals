
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
    var recipe,
        id = req.params.id;
    if (id >= recipes.length) {
        return res.send({
            error: "recipe not found"
        }, 404);
    }

    recipe = recipes[id];
    if (!recipe) {
        return res.send({
            error: "recipe gone"
        }, 410);
    }

    res.send(recipe);
});

app.get('/recipes', function (req, res) {
    var i, item, list = [];
    for (i = 0; i < recipes.length; i++) {
        item = recipes[i];
        if (item) {
            list.push({
                title: item.title,
                author: item.author,
                id: item.id
            });
        }
    }
    res.send(list);
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


app.delete('/recipes/:id', function (req, res) {
    var id = req.params.id;
    if (recipes[id]) {
        delete(recipes[id]);
    }
    res.send(204);
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
