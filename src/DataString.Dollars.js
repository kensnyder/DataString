DataString.Dollars = DataString.Number.createSubclass({
	format: function(doRound) {
		return '$' + DataString._formatNumber(this.toValue(), doRound ? 0 : 2);
	}
});