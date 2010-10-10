/*
 * DataString JavaScript and PHP Library v%VERSION%
 * (c) 2010 Ken Snyder, MIT-style license
 * http://http://github.com/kensnyder/DataString
 */
(function(global) {

	// Helper Functions
	function extend(d, s) {
		for (var p in s) {
			if (Object.prototype.hasOwnProperty.call(s, p)) {
				d[p] = s[p];
			}
		}
		// since valueOf and toString are not enumerable, do a special check
		if (Object.prototype.valueOf !== s.valueOf) {
			d.valueOf = s.valueOf;
		}
		if (Object.prototype.toString !== s.toString) {
			d.toString = s.toString;
		}
	}
	function $(id) {
		return typeof id == 'string' ? document.getElementById(id) : id;
	}
	var symbolMap = {
		// first character is symbol, then shift+symbol
		// Unless labeled, browser specs are for Windows Vista
		// references:
		//   personal testing,
		//   http://unixpapa.com/js/key.html
		// < 32 are control chars
		32: '  ', // All
		39: '\'"', // Op?
		42: '**', // Op10.62
		43: '==', // Op10.62
		44: ',<', // Op?
		45: '--', // Op10.62
		46: '.>', // Op?
		47: '//', // Op10.62
		// 48-57 are digits 0-9
		59: ';:', // FF3.6, S5, Ch6, Op10.62
		61: '=+', // Op10.62
		// 65-90 are letters [a-z]
		91: '[{', // Op?
		92: '\\|', // Op?
		93: ']}', // Op?
		// 96-105 are keypad digits
		106: '**', // FF3.6, S5, Ch6, IE8
		107: '=+', // FF3.6, IE8  (Note: num pad + on some keyboards will be 107)
		109: '-_', // FF3.6, Op10.62, IE8
		110: '..', // FF3.6, S5, Ch6
		111: '//', // FF3.6, IE8
		126: '`~', // Mac FF?
		186: ';:', // S5, Ch6, IE8
		187: '=+', // S5, Ch6
		188: ',<', // FF3.6, S5, Ch6, Op10.62, IE8
		189: '-_', // S5, Ch6
		190: '.>', // FF3.6, S5, Ch6, Op10.62, IE8
		191: '/?', // FF3.6, S5, Ch6, Op10.62, IE8
		192: '`~', // FF3.6, S5, Ch6, Op10.62, IE8
		219: '[{', // FF3.6, S5, Ch6, Op10.62, IE8
		220: '\\|', // FF3.6, S5, Ch6, Op10.62
		221: ']}', // FF3.6, S5, Ch6, Op10.62, IE8
		222: '\'"' // FF3.6, S5, Ch6, Op10.62, IE8
	};
	function eventAscii(evt) {
		var kc = evt.keyCode, ascii;
		if (kc < 32) { // non-printable chars
			return;
		}
		else if (kc >= 48 && kc <= 57) { // 0-9
			ascii = String.fromCharCode(kc);
			if (evt.shiftKey) {
				ascii = ")!@#$%^&*(".charAt(ascii);
			}
		}
		else if (kc >= 65 && kc <= 90) { // a-z
			ascii = String.fromCharCode(kc);
			if (!evt.shiftKey) {
				ascii = ascii.toLowerCase();
			}
		}
		else if (kc >= 96 && kc <= 105) { // keypad digits
			ascii = "0123456789".charAt(kc-96);
		}
		else if ((ascii = symbolMap[kc])) { // symbols
			ascii = ascii.charAt(evt.shiftKey ? 1 : 0);
		}
console.log(evt.keyCode, ascii);
		return ascii;
	}
	var listen = document.addEventListener ?
		function(element, type, callback) {
			element.addEventListener(type, callback, false);
		} :
		function(element, type, callback) {
			element.attachEvent("on" + type, callback);
		}
	;
	// end helper functions

	var staticProps = {
		validateInput: function(input, callback) {
			input = $(input);
			var me = new this;
			function validate() {
				me.raw = input.value;
				if (!me.isValid()) {
					callback.call(me, input);
				}
			}
			listen(input, 'blur', validate);
			listen(input, 'change', validate);
		},
		autoFormatInput: function(input, formatArgs) {
			input = $(input);
			var me = new this;
			function autoFormat() {
				me.raw = input.value;
				input.value = me.format.apply(me, formatArgs);
			}
			listen(input, 'blur', autoFormat);
			listen(input, 'change', autoFormat);
		},
		keyMaskInput: function(input) {
			input = $(input);
			var me = new this;
			function mask(evt) {
				evt = evt || window.event;
				if (evt.ctrlKey || evt.metaKey || evt.altKey || !evt.keyCode) {
					return;
				}
				var c = eventAscii(evt);
				if (c && !me.isAllowedChar(c)) {
					evt.preventDefault && evt.preventDefault();
					evt.returnValue = false;
				}
			}
			listen(input, 'keydown', mask);
		}
	};

	var instanceProps = {
		version: '%VERSION%',
		setValue: function(value) {
			this.raw = (typeof value == 'undefined' || value === null ? '' : value + '').replace(/^\s+/, '').replace(/\s+$/, '');
			return this;
		},
		equals: function(value) {
			return this.toString() === (value instanceof DataString ? value : new this.constructor(value)).toString();
		},
		copy: function() {
			return new this(this.toString());
		},
		isValid: function() {
			return true;
		},
		isEmpty: function() {
			return this.raw === '';
		},
		format: function() {
			return this.raw;
		},
		toString: function() {
			return this.format();
		},
		// remember, this is not enumerable!
		valueOf: function() {
			return this.raw;
		},
		isAllowedChar: function(c) {
			return true;
		}
	};

	var createSubclass = function(methods) {
		var klass = function(value) {
			if (value !== nada) {
				this.setValue(value)
			}
		};
		extend(klass, staticProps);
		klass.createSubclass = createSubclass;
		klass.prototype = new this(nada);
		klass.prototype.constructor = klass;
		klass.prototype.constructor.parent = this;
		if (methods) {
			extend(klass.prototype, methods);
		}
		return klass;
	};

	var nada = {};
	// constructor (same as above)
	function DataString(value) {
		if (value !== nada) {
			this.setValue(value)
		}
	}
	DataString.createSubclass = createSubclass;
	extend(DataString, staticProps);
	extend(DataString.prototype, instanceProps);

	// public helper methods
	DataString.numberFormat = function(n, precision) {
		n = parseFloat(n + '');
		n = isNaN(n) ? 0 : n;
		if (precision >= 0) {
			n = n.toFixed(precision);
		}
		else {
			n = '' + n;
		}
		var parts = n.split('.');
		var whole = parts[0];
		var decimal = parts[1];
		var sign = (whole.charAt(0) == '-' ? '-' : '');
		whole = whole.replace('-', '');
		var threes = [];
		while (whole.length) {
			threes.unshift(whole.slice(-3));
			whole = whole.slice(0, -3);
		}
		return sign + 
			threes.join(DataString.numberFormat.thousandsSeparator) +
			(decimal ? DataString.numberFormat.decimalPoint + decimal : '');
	};
	DataString.numberFormat.thousandsSeparator = ',';
	DataString.numberFormat.decimalPoint = '.';
	// end public helper methods

	// assign to global
	global.DataString = DataString;

})(this);

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


DataString.Cc = DataString.createSubclass({
	matcher15: /^(\d{4})\D?(\d{6})\D?(\d{5})$/,
	matcher16: /^(\d{4})\D?(\d{4})\D?(\d{4})\D?(\d{4})$/,
	isValid: function() {
		return this.isValidFormat() && this.isValidChecksum() && this.isSupportedType();
	},
	isSupportedType: function() {
		var type = this.getType();
		var supp = this.getSupportedTypes().join(' ');
		// use strings to avoid IE's missing Array#indexOf
		return (' ' + supp + ' ').indexOf(' ' + type + ' ') > -1;
	},
	isValidFormat: function() {
		return this.matcher16.test(this.raw) || this.matcher15.test(this.raw);
	},
	isValidChecksum: function() {
		var digits = this.valueOf();
		var i = 0, sum = 0;
		while (i < digits.length) {
			sum += ((i % 2) == 0 ? 2 : 1) * parseInt(digits.substr(i++,1), 10);
		}
		return (sum % 10) == 0;
	},
	format: function(addMask) {
		var m;
		if ((m = this.raw.match(this.matcher16))) {
			if (addMask) {
				m[1] = 'XXXX';
				m[2] = 'XXXXXX';
				m[3] = 'X' . m.slice(1);
			}
			m.shift();
			return m.join('-');
		}
		else if ((m = this.raw.match(this.matcher15))) {
			if (addMask) {
				m[1] = m[2] = m[3] = 'XXXX';
			}
			m.shift();
			return m.join('-');
		}
		return this.raw;
	},
	valueOf: function() {
		return this.raw.replace(/\D/g, '');
	},
	getType: function() {
		// not intended to validate number, just guess what card type user
		// is trying to use by looking at known prefixes
		var m;
		if ((m = this.raw.match(/^(3[4-7]|4|5|6011)/))) {
			switch (m[1]) {
				case '6011': return 'disc';
				case '5':    return 'mc';
				case '4':    return 'visa';
			}
			return 'amex';
		}
	},
	getSupportedTypes: function() {
		return ['amex', 'mc', 'disc', 'visa'];
	},
	isAllowedChar: function(c) {
		return /[\d -]/.test(c);
	}
});


DataString.Date = DataString.createSubclass({
	//
	// A list of conversion patterns, each an array with two items
	//   where first item is regex and second is replacement string or Function
	// Add, remove or splice a patterns to customize date parsing ability
	//
	// parsers that all browsers seem to safely handle:
	//   Mar 15, 2010
	//   March 15, 2010
	//   3/15/2010
	//   03/15/2010
	//
	//   pattern for year 1000 through 9999: ([1-9]\d{3})
	//   pattern for month number: (1[0-2]|0\d|\d)
	//   pattern for month name: (?:(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*)
	//   pattern for day of month: (3[01]|[0-2]\d|\d)
	parsers: [
		// 3/15/2010
		[/(1[0-2]|0\d|\d)\s*\/\s*(3[01]|[0-2]\d|\d)\s*\/\s*([1-9]\d{3})/, '$2/$3/$1'],
		// 2010-03-15
		[/([1-9]\d{3})\s*-\s*(1[0-2]|0\d|\d)\s*-\s*(3[01]|[0-2]\d|\d)/, '$2/$3/$1'],
		// 3-15-2010
		[/(1[0-2]|0\d|\d)\s*[\/-]\s*(3[01]|[0-2]\d|\d)\s*[\/-]\s*([1-9]\d{3})/, '$1/$2/$3'],
		// 15-Mar-2010
		[/(3[01]|[0-2]\d|\d)\s*[ -]\s*(?:(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*)\s*[ -]\s*([1-9]\d{3})/i, '$2 $1, $3'],
		// March 15, 2010
		[/(?:(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*)\s+(3[01]|[0-2]\d|\d),?\s*([1-9]\d{3})/i, '$2 $1, $3'],
		// 15.03.2010
		[/(3[01]|[0-2]\d|\d)\s*\.\s*(1[0-2]|0\d|\d)\s*\.\s*([1-9]\d{3})/, '$2/$1/$3']
	],
	setValue: function(date) {
		this.date = undefined;
		var parser, i = 0;
		while ((parser = this.parsers[i++])) {
			if (!date.match(parser[0])) {
				continue;
			}
			this.date = new Date(Date.parse(date.replace(parser[0], parser[1])));
		}
		return this;
	},
	isValid: function() {
		return !!this.date;
	},
	format: function() {
		if (!this.isValid()) {
			return '';
		}
		var month = this.date.getMonth() + 1;
		return this.date.getFullYear() + '-' + (month < 10 ? '0' : '') + month + '-' + this.date.getDate();
	},
	valueOf: function() {
		return this.date;
	}
});


DataString.Number = DataString.createSubclass({
	isValid: function() {
		return this.raw.match(/^-?[\d,]+(:?\.[\d]+)?%?$/)
	},
	format: function(precision) {
		return DataString.numberFormat(this.valueOf(), precision);
	},
	valueOf: function() {
		var n = parseFloat(this.raw.replace(/[^\d.-]/g, ''));
		return isNaN(n) ? 0 : n;
	},
	isAllowedChar: function(c) {
		return /[\d$.-]/.test(c);
	}
});

DataString.Dollars = DataString.Number.createSubclass({
	format: function(doRound) {
		return '$' + DataString.numberFormat(this.valueOf(), doRound ? 0 : 2);
	}
});

DataString.Email = DataString.createSubclass({
	matcher: /^[^@]+@[^@]+$/,
	isValid: function() {
		return this.matcher.test(this.raw);
	}
});


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

DataString.PhoneUs10 = DataString.createSubclass({
	matcher: /^1?\D*([2-9]\d{2})\D*([2-9]\d{2})\D*(\d{4})($|\D.*$)/,
	isValid: function() {
		var m = this.raw.match(this.matcher);
		if (!m || m[2] == '555') {
			return false;
		}
		return true;
	},
	format: function() {
		return this.raw.replace(this.matcher, '($1) $2-$3$4');
	},
	valueOf: function() {
		return this.raw.replace(this.matcher, '$1$2$3');
	}
});


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