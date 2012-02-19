/*
 * TODO:
 *
 * login
 * new recipe author must be the logged in user
 */


Recipe = Backbone.Model.extend({

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

    url: '/recipes'
});


RecipeListView = Backbone.View.extend({

    tagName: "ul",

    id: "recipes",

    initialize: function () {
        _.bindAll(this, 'addItem', 'render');
    },

    addItem: function (model) {
        var itemView = new RecipeListItemView({model: model});
        itemView.render();
        $(this.el).append(itemView.el);
    },

    render: function () {
        this.collection.each(this.addItem);
    }
});

RecipeListItemView = Backbone.View.extend({

    tagName: "li",

    className: "clickable",

    initialize: function () {
        _.bindAll(this, "render");
    },

    events: {
        "click": "open"
    },

    render: function () {
        var template = $("#recipe-list-view-template").html();
        $(this.el).html(_.template(template, this.model.toJSON()));
    },

    open: function () {
        console.log(this.model.toJSON());
    }
});


$(function () {
    var recipes = new Recipes(),
        list = new RecipeListView({
            collection: recipes
        });

    window.recipes = recipes;

    list.render();
    $("#content").append(list.el);

    recipes.on("add", list.addItem);

    recipes.fetch({
        success: function (coll, res) { list.render(); },
        error: function (coll, res) { alert("Errore!"); }
    });
});
