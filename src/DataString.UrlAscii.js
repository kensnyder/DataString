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
		/*
		var combined =
			parts.scheme + '://' +
			(parts.user || '') +
			(parts.password ? ':' + parts.password : '') +
			(parts.user ? '@' : '') +
			parts.host +
			(parts.port ? ':' + parts.port : '') +
			(parts.path || '') +
			(parts.query ? '?' + parts.query : '') +
			(parts.fragment ? '#' + parts.fragment : '');
			*/
console.log(combined);
		return this.raw == combined;
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
		if ((!parts.scheme || !parts.host) || (parts.password && !parts.user)) {
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