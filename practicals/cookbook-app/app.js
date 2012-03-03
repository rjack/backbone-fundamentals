
/**
 * Module dependencies.
 */

var express = require('express'),
    redis = require('redis'),
    routes = require('./routes');

var app = module.exports = express.createServer();

var users = {
    "foo": {
        "password": "bar"
    }
};

var ONE_WEEK = 604800000;

var r = redis.createClient();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({key: "session", maxAge: ONE_WEEK, secret: "ino"}));
  app.use(app.router);
  app.use(express['static'](__dirname + '/public'));
});


app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


function checkAuth (req, res, next) {
    var sess = req.session;

    if (sess.auth) {
        next();
    } else {
        res.send({
            error: "unauthorized",
            solve: "/users/login"
        }, 403);
    }
}


// Routes

app.get('/recipes/:id', function (req, res) {
    var id = req.params.id;

    r.hgetall("recipes:" + id, function (err, recipe) {
        if (err) {
            return res.send({
                error: "not found",
                solve: "/search"
            }, 404);
        } else {
            res.send(recipe);
        }
    });
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

app.post('/recipes', checkAuth, function (req, res) {
    var recipe  = req.body;
    recipe.id = recipes.length;
    recipes.push(recipe);
    res.send(recipe);
});

app.put('/recipes/:id', checkAuth, function (req, res) {
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


app['delete']('/recipes/:id', checkAuth, function (req, res) {
    var id = req.params.id;
    if (recipes[id]) {
        delete(recipes[id]);
    }
    res.send(204);
});


app.post('/users/auth', function (req, res) {
    var user, pass,
        auth = req.body;
    if (!auth.username || !(user = users[auth.username]) || user.password !== auth.password) {
        res.send({
            error: "bad credentials"
        }, 401);
    } else {
        req.session.auth = true;
        if (!auth.remember) {
            req.session.cookie.expires = false;
        }
        res.send({
            username: auth.username
        });
    }
});


r.on("error", redis.print);

r.on("ready", function () {
    // TODO: read db_id from argv
    // TODO: r.select(db_id);
    app.listen(3000);
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
