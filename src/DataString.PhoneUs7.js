DataString.PhoneUs7 = DataString.createSubclass({
	matcher: /^([2-9]\d{2})\D*(\d{4})($|\D.*$)/,
	isValid: function() {
		var m = this.raw.match(this.matcher);
		if (!m || m[1] == '555') {
			return false;
		}
		return true;
	},
	format: function() {
		return this.raw.replace(this.matcher, '$1-$2$3');
	},
	valueOf: function() {
		return this.raw.replace(this.matcher, '$1$2');
	}
});
