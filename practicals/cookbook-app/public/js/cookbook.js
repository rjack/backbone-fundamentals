/*
 * TODO:
 *
 * login
 * new recipe author must be the logged in user
 */


Backbone.View.prototype.close = function () {
    this.undelegateEvents();
};


$(function () {
    var APP = {};
    window.APP = APP;

    APP.router = new Router();

    Backbone.history.start({pushState: false});
});


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


Page = Backbone.View.extend({

    initialize: function (options) {
        this.template = _.template($(options.template).html());
        this.context = options.context || {};
    },

    render: function () {
        $(this.el).html(this.template(this.context));
        return this;
    }
});


RecipeFormPage = Page.extend({

    initialize: function (options) {
        options = options || {};
        options.template = "#recipe-form-template";
        Page.prototype.initialize.call(this, options);
    },

    events: {
        "submit": "sendForm"
    },

    sendForm: function (ev) {
        var recipe = new Recipe({
                title: $("#input-title").val(),
                author: $("#input-author").val(),
                instructions: $("#input-instructions").val()
            });
        ev.preventDefault();
        recipe.on("sync", function () {
            APP.router.navigate("recipes/" + recipe.id, {trigger: true});
        });
        recipe.save();
    }
});


RecipeListView = Backbone.View.extend({

    initialize: function (options) {
        _.bindAll(this, 'createChildView', 'renderChildViews', 'render');
        $(this.el).html(_.template($("#recipe-list-page-template").html()));
    },

    createChildView: function (model) {
        var itemView = new RecipeListItemView({
            model: model
        });
        return itemView;
    },

    renderChildViews: function (ul, li) {
        ul.append(li.render().el);
        return ul;
    },

    render: function () {
        var self = this,
            list = $(this.el).find("#recipes");
        this.collection.fetch({
            success: function () {
                self.childViews = self.collection.chain().map(self.createChildView);
                self.childViews.reduce(self.renderChildViews, list);
            },
            error: function () {
                alert("RecipeListView: cannot fetch collection");
            }
        });

        return this;
    },

    close: function () {
        this.childViews.each(function (child) {
            child.close();
        });
        Backbone.View.prototype.close.call(this);
    }
});

RecipeListItemView = Backbone.View.extend({

    tagName: "li",

    initialize: function (options) {
        _.bindAll(this, "render");
        this.template = _.template($("#recipe-list-item-template").html());
    },

    events: {
        "click": "open"
    },

    render: function () {
        context = this.model.toJSON();
        context.href = '#' + this.model.url();

        $(this.el).html(this.template(context));

        return this;
    },

    open: function (ev) {
        console.log("CLICK", ev);
    }
});


RecipeView = Backbone.View.extend({

    initialize: function (options) {
        _.bindAll(this, 'render');
        this.template = _.template($("#recipe-template").html());
    },

    events: {
        "click button.delete": "deleteRecipe"
    },

    render: function () {
        var self = this;

        this.model.fetch({
            success: function () {
                $(self.el).html(self.template(self.model.toJSON()));
            }
        });
        return this;
    },

    deleteRecipe: function () {
        this.model.destroy({
            error: function () {
                alert ("RecipeView: cannot destroy " + this.model.get("title"));
            },
            success: function () {
                APP.router.navigate("recipes", {trigger: true});
            }
        });
    }
});


Router = Backbone.Router.extend({

    routes: {
        "": "showRecipeList",
        "recipes": "showRecipeList",
        "recipes/new": "showForm",
        "recipes/:id": "showRecipe"
    },

    switchView: function (view) {
        if (this.currentView) {
            this.currentView.close();
        }
        this.currentView = view;
    },


    showRecipeList: function () {
        var view = new RecipeListView({
                collection: new Recipes()
            });
        this.switchView(view);
        $("#content").html(view.render().el);
    },


    showRecipe: function (id) {
        var recipe = new Recipe({id: id}),
            view = new RecipeView({model: recipe});
        this.switchView(view);
        $("#content").html(view.render().el);
    },

    showForm: function () {
        var view = new RecipeFormPage();
        this.switchView(view);
        $("#content").html(view.render().el);
    }
});
