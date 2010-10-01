DataString.Number = DataString.createSubclass({
	isValid: function() {
		return this.raw.match(/^\$?\s*[\d,.-]+$/)
	},
	format: function(precision) {
		return DataString.numberFormat(this.valueOf(), precision);
	},
	valueOf: function() {
		var n = parseFloat(this.raw);
		return isNaN(n) ? 0 : n;
	},
	isAllowedChar: function(c) {
		return /[\d$.-]/.test(c);
	}
});