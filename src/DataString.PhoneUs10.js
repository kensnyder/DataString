DataString.PhoneUs10 = DataString.createSubclass({
	matcher: /^1?\D*([2-9]\d{2})\D*([2-9]\d{2})\D*(\d{4})($|\D.*$)/,
	isValid: function() {
		var m = this.raw.match(this.matcher);
		return m && m[2] != '555';
	},
	format: function() {
		return this.raw.replace(this.matcher, '($1) $2$3$4');
	},
	toValue: function() {
		return this.raw.replace(this.matcher, '$1$2$3$4');
	}
});
