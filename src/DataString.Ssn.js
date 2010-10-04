DataString.PhoneUs10 = DataString.createSubclass({
	matcher: /^(\d{3})\D*(\d{2})\D*(\d{4})$/,

	isValid: function() {
		var m = this.raw.match(this.matcher);
		if (!m) {
			return false;
		}
		// see http://www.socialsecurity.gov/history/ssn/geocard.html
		// and http://www.socialsecurity.gov/employer/stateweb.htm
		if (m[1] == '000' || m[2] == '00' || m[3] == '0000') {
			return false;
		}
		// currently the highest area number (first 3 digits) is 733, but we allow higher
		return;
	},

	format: function() {
		var m;
		if ((m = this.raw.match(this.matcher))) {
			return m[1] + '-' + m[2] + '-' + m[3];
		}
		return this.raw;
	},

	valueOf: function() {
		var m;
		if ((m = this.raw.match(this.matcher))) {
			return m[1] + m[2] + m[3];
		}
		return this.raw;
	}

});