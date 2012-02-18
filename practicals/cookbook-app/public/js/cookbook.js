var COOKBOOK = {}

COOKBOOK.models = {};

COOKBOOK.models.Recipe = Backbone.Model.extend({

    urlRoot: "/recipes",

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
