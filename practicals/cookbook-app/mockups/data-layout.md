# Data Layout

## Users

* `users`: set of user ids.
* `users:<id>`: hash containg user informations

## Recipes

* `recipes`: set of recipe ids
* `recipes:<id>`: hash containg recipe informations

## Indexes

Sorted sets are used as indexes for recipes.

This allows queries like "get the first 10 recipes ordered by rating", or "get
the last 50 new recipes"

* `index:recipes:by-created-at`
* `index:recipes:by-difficulty`
* `index:recipes:by-rating`

**Note**: `index:recipes:by-created-at` could be a `list`. Worth it?
