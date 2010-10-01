DataString.Number = DataString.createSubclass({
	isValid: function() {
		return this.raw.match(/^\$?\s*[\d,.-]+$/)
	},
	format: function(precision) {
		return '$' + DataString.numberFormat(this.valueOf(), precision);
	},
	valueOf: function() {
		return Number(this.raw.replace(/[^\d.-]/g, ''));
	},
	isAllowedChar: function(c) {
		return /[\d$.-]/.test(c);
	}
});