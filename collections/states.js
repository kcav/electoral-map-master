var app = app || {};

var States = Backbone.Collection.extend({
	model: app.State, 
});

app.states = new States();