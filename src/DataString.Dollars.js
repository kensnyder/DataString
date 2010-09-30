DataString.Dollars = DataString.createSubclass({
	isValid: function() {
		return this.raw.match(/^\$?\s*[\d,.-]+$/)
	},
	format: function(round) {
		return '$' + DataString._formatNumber(this.toValue(), round ? 0 : 2);
	},
	toValue: function() {
		return Number(this.raw.replace(/[^\d.-]/g, ''));
	},
	isAllowedChar: function(c) {
		return /[\d$.-]/.test(c);
	}
});