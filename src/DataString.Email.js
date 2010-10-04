DataString.Email = DataString.createSubclass({
	matcher: /^[^@]+@[^@]+$/,
	isValid: function() {
		return this.matcher.test(this.raw);
	}
});
