/*
 * TODO:
 *
 * login
 * new recipe author must be the logged in user
 */


Recipe = Backbone.Model.extend({

    urlRoot: "recipes",

    validate: function (attrs) {
        if (!attrs.author) {
            return "Author not set";
        }
        if (!attrs.title) {
            return "Title not set";
        }
        if (!attrs.instructions) {
            return "Instructions not set";
        }
    }
});


Recipes = Backbone.Collection.extend({

    model: Recipe,

    url: 'recipes'
});


RecipeListView = Backbone.View.extend({

    tagName: "ul",

    id: "recipes",

    initialize: function (options) {
        _.bindAll(this, 'addItem', 'render');
        this.collection.on("add", this.addItem);
        this.collection.fetch({
            success: this.render,
            error: function (coll, res) { alert("Errore!"); }
        });
    },

    addItem: function (model) {
        var itemView = new RecipeListItemView({
            model: model
        });
        itemView.render();
        $(this.el).append(itemView.el);
    },

    render: function () {
        this.collection.each(this.addItem);
    }
});

RecipeListItemView = Backbone.View.extend({

    tagName: "li",

    initialize: function (options) {
        _.bindAll(this, "render");
    },

    render: function () {
        var template = $("#recipe-list-view-template").html(),
            context = this.model.toJSON();

        context.href = '#' + this.model.url();
        $(this.el).html(_.template(template, context));
    },
});


RecipeView = Backbone.View.extend({

    el: "#content",

    initialize: function (options) {
        _.bindAll(this, 'render');
        this.model.on('change', this.render);
    },

    render: function () {
        var template = $("#recipe-template").html(),
            context = this.model.toJSON();

        $(this.el).html(_.template(template, context));
    }
});


Router = Backbone.Router.extend({

    routes: {
        "": "showRecipeList",
        "recipes/:id": "showRecipe"
    },


    showRecipeList: function () {
        var recipes = new Recipes();
        var view = new RecipeListView({
            collection: recipes
        });

        view.render();
        $("#content").html(view.el);
    },


    showRecipe: function (id) {
        var recipe = new Recipe({id: id});
        var view = new RecipeView({model: recipe});
        recipe.fetch({
            error: function () {
                alert ("Error fetching recipe " + id);
            }
        });
    }
});


$(function () {
    var router = new Router();
    Backbone.history.start();
});
