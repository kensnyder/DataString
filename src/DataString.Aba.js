DataString.Aba = DataString.createSubclass({
	isValid: function() {
		var $n = this.format();
		// http://www.brainjar.com/js/validation/
		if ($n.length != 9 || $n == '000000000') {
			return false;
		}
		var $sum = (
			($n[0] * 3) + ($n[1] * 7) + ($n[2] * 1) +
			($n[3] * 3) + ($n[4] * 7) + ($n[5] * 1) +
			($n[6] * 3) + ($n[7] * 7) + ($n[8] * 1)
		);
		return (($sum % 10) == 0);
	},
	format: function() {
		return this.raw.replace(/\D/g, '');
	},
	isAllowedChar: function(c) {
		return /\d/.test(c);
	}
});
