DataString.ZipUs = DataString.createSubclass({
	matcher: /^(\d{5})(:?-(\d{4}))$/,
	isValid: function() {
		return this.matcher.test(this.raw);
	},
	valueOf: function() {
		if (!this.isValid) {
			return '';
		}
		var match = this.raw.match(this.matcher);
		return match ? match[1] : '';
	}
});
