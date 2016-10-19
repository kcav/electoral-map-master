var app = app || {};

app.State = Backbone.Model.extend({
	defaults: {
		'party' : 'tbd',
		'votes' : null
	},

	// Toggle the party of the state
	toggle: function() {

		var originalParty = this.get('party');

		// Check if state allocates electoral votes by districts (ME & NE)
		var votesByDistrict = false;
		if ( this.get('id') == 'ME' || 'NE' ) {
			 votesByDistrict = true;
		}

		//  Set all districts within a state
		var setDistricts = function(party, state) {
			state.set('atLarge', party);
			state.set('district1', party);
			// Only NE has a second split district; check that it exists before setting
			if (state.get('district2')) {
				state.set('district2', party)
			}
		}

		switch(originalParty) {
			case 'tbd':
				this.set('party', 'dem');
				if ( votesByDistrict ) {
					setDistricts('dem', this);
				}
				break;
			case 'dem':
				this.set('party', 'gop');
				if ( votesByDistrict ) {
					setDistricts('gop', this);
				}
				break;
			case 'gop':
				this.set('party', 'tbd');
				if ( votesByDistrict ) {
					setDistricts('tbd', this);
				}
				break;
			case 'split':
				this.set('party', 'tbd');
				if ( votesByDistrict ) {
					setDistricts('tbd', this);
				}
		}
	},

	// Toggle a district within a state
	toggleDistrict: function(district) {

		var originalParty = this.get(district);
		
		switch(originalParty) {
			case 'tbd':
				this.set(district, 'dem');
				this.checkIfSplit();
				break;
			case 'dem':
				this.set(district, 'gop');
				this.checkIfSplit();
				break;
			case 'gop':
				this.set(district, 'tbd');
				this.checkIfSplit();
		}
	},

	// Check if districts are split after a district is toggled
	checkIfSplit: function() {

		var atLarge = this.get('atLarge');
		var district1 = this.get('district1');
		var district2 = this.get('district2');

		console.log(atLarge + ' / ' + district1 + ' / ' + district2)

		if (atLarge != district1) {
			this.set('party', 'split');
			return;
		}

		if (!district2) {
			this.set('party', atLarge)
			return;
		}

		if (district1 != district2) {
			this.set('party', 'split');
			return;
		} else {
			this.set('party', atLarge)
		}
	}


})