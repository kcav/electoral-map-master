var app = app || {};

app.ScoreboardView = Backbone.View.extend({
	el: "#scoreboard",

	initialize: function() {
		this.listenTo(app.states, 'all', this.render);
	},

	render: function() {
		// Count the votes of a given party
		var countVotes = function(party) {
			var count = 0;
			var states = app.states.where({party: party});
			for (var i = 0; i < states.length; i++) {
				count += states[i].get('votes')
			}

			// Account for states that allocate electoral votes by district (NE & ME)
			var splitStates = app.states.where({party: 'split'});
			for (var i = 0; i < splitStates.length; i++) {
				if (splitStates[i].get('atLarge') == party ) {
					count += 3;
				}
				if (splitStates[i].get('district1') == party ) {
					count += 1;
				}
				if (splitStates[i].get('district2') == party ) {
					count += 1;
				}
			}
			return count;
		}

		// Count the votes of each party
		var votes = {
			dem: countVotes('dem'),
			gop: countVotes('gop'),
			tbd: countVotes('tbd')
		}

		// Calculate percentage width of a votes bar
		var calculateWidth = function(votes) {
			return (votes / 538) * 100 + '%';
		}

		// Display votes bars & labels
		this.$('#dem-votes-bar').css('width', calculateWidth( votes.dem) );
		this.$('#tbd-votes-bar').css('width', calculateWidth( votes.tbd) );
		this.$('#gop-votes-bar').css('width', calculateWidth( votes.gop) );

		this.$('#dem-votes-count').html( votes.dem );
		this.$('#gop-votes-count').html( votes.gop );
		this.$('#tbd-votes-count').html( votes.tbd );

		
		// Display a message according to vote counts
		var $message = this.$('#message-text');
		var $messageWrapper = this.$('.message-wrapper');

		if ( votes.dem > 269) {
			$messageWrapper.attr('class', 'message-wrapper dem-victory');
			$message.html('Democratic Victory');
		} else if ( votes.gop > 269) {
			$messageWrapper.attr('class', 'message-wrapper gop-victory');
			$message.html('Republican Victory');
		} else if ( votes.dem == 269 && votes.gop == 269) {
			$messageWrapper.attr('class', 'message-wrapper electoral-tie');
			$message.html('Electoral College Tie');
		} else {
			$messageWrapper.attr('class', 'message-wrapper');
			$message.html('&nbsp;');
			
		}
	},
});

var scoreboard = new app.ScoreboardView();