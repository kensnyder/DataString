DataString.Percent = DataString.Number.createSubclass({

	format: function(precision) {
		if (!this.isValid()) {
			return '';
		}
		var num = this.raw.replace(/\D/g, '');
		if (typeof precision != 'undefined') {
			num = num.toFixed(precision);
		}
		return num + '%';
	},

	valueOf: function() {
		var num = parseFloat(this.raw.replace(/\D/g, ''));
		if (isNaN(num)) {
			return 0;
		}
		return num / 100;
	},

	isAllowedChar: function(c) {
		return (/[\d,.%-]/).test(c);
	}

});