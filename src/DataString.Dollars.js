DataString.Dollars = DataString.Number.createSubclass({
	format: function(doRound) {
		return '$' + DataString.numberFormat(this.valueOf(), doRound ? 0 : 2);
	},
	valueOf: function() {
		return parseFloat(this.raw.replace(/[^\d.-]/g, ''));
	}
});