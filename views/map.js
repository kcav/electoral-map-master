var app = app || {};

var parseDistrictId = function(districtId) {
	var districtId = districtId.split('-');
	return {
		state: districtId[0],
		district: districtId[1]
	};
};

app.MapView = Backbone.View.extend({
	el: "#map",

	events: {
		'click .state': 'clickState',
		'click .district': 'clickDistrict'
	},

	initialize: function() {
		this.listenTo(app.states, 'all', this.render);
	},

	render: function() {
		Snap.selectAll('.state').forEach(function(el) {
			var newClass = app.states.get( el.attr('id') ).get('party');
			el.removeClass('dem gop tbd split');
			el.addClass(newClass);
		});

		Snap.selectAll('.district').forEach(function(el) {
			var districtId = parseDistrictId( el.attr('id') );
			var newClass = app.states.get(districtId.state).get(districtId.district);
			el.removeClass('dem gop tbd split');
			el.addClass(newClass);
		});

	},

	clickState: function(event) {
		var stateClicked = event.target.id;
		app.states.get(stateClicked).toggle();
	},

	clickDistrict: function(event) {
		var districtId = parseDistrictId(event.target.id);
		app.states.get(districtId.state).toggleDistrict(districtId.district);
	}

});

var map = new app.MapView();