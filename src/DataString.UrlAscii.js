DataString.UrlAscii = DataString.createSubclass({

	matchers: {
		scheme: /^([a-z]+)\:/i,
		user: /:\/\/([\w._+-]+)(?:\:|@)/,
		pass: /:([\w._+-]+)@/,
		host: /(?:@|\:\/\/)([\w.-]+)/,
		host2: /@([\w.-]+)/,
		port: /:(\d+)(?:\/|$)/,
		path: /:\/\/[\w:@._+-]+\/([^?#]+)/,
		query: /\?([^#]+)(?:#|$)/,
		fragment: /#(.+)$/
	},

	isValid: function() {
		return !!this.getParts();
	},

	getParts: function() {
		var parts = {}, m;
		for (var part in this.matchers) {
			if ((m = this.raw.match(this.matchers[part]))) {
				parts[part] = m[1];
			}
			else {
				parts[part] = false;
			}
		}
		if (!parts.scheme || !parts.host) {
			return false;
		}
		parts.path = parts.path ? parts.path.replace(/\/$/, '') : false;
		if (parts.pass == parts.port) {
			parts.pass = false;
		}
		if (parts.user == parts.host) {
			m = this.raw.match(this.matchers.host2);
			if (!m) {
				return false;
			}
			parts.host = m[1];
		}
		return parts;
	}

});