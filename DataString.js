(function(global) {

	var nada = {};
	function extend(d, s) {
		for (var p in s) {
			if (Object.prototype.hasOwnProperty.call(s, p)) {
				d[p] = s[p];
			}
		}
	}
	function $(id) {
		return typeof id == 'string' ? document.getElementById(id) : id;
	}
	var listen = document.addEventListener ?
		function(element, type, callback) {
			element.addEventListener(type, callback, false);
		} :
		function(element, type, callback) {
			element.attachEvent("on" + type, callback);
		}
	;
	function DataString(value) {
		if (value !== nada) {
			this.setValue(value)
		}
	}

	var staticMethods = {
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
				var kc = evt.keyCode;
				console.log(kc, String.fromCharCode(kc));
				if (kc < 10/*Tab and backspace*/ || kc == 27/*Esc*/) {
					return;
				}
				var c = String.fromCharCode(kc);
				if (c && !me.isAllowedChar(c)) {
					evt.preventDefault && evt.preventDefault();
					evt.returnValue = false;
				}
			}
			listen(input, 'keydown', mask);
		}
	};

	function createSubclass(methods) {
		var klass = function(value) {
			if (value !== nada) {
				this.setValue(value)
			}
		};
		extend(klass, staticMethods);
		klass.createSubclass = createSubclass;
		klass.prototype = new DataString(nada);
		klass.prototype.constructor = klass;
		klass.prototype.constructor.parent = this;
		if (methods) {
			extend(klass.prototype, methods);
		}
		return klass;
	};
	DataString.createSubclass = createSubclass;
	extend(DataString, staticMethods);

	DataString._thousandsSeparator = ',';
	DataString._decimal = '.';
	DataString._formatNumber = function(n, precision) {
		n = Number(parseFloat(n + '')).toFixed(precision);
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
		return sign + threes.join(DataString._thousandsSeparator) + (decimal ? DataString._decimal + decimal : '');
	};

	//
	// instance methods
	extend(DataString.prototype, {
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
		toValue: function() {
			return this.raw;
		},
		isAllowedChar: function(c) {
			return true;
		}
	});

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
	matcher15: /^(\d{4})\D*(\d{6})\D*(\d{5})$/,
	matcher16: /^(\d{4})\D*(\d{4})\D*(\d{4})\D*(\d{4})$/,
	isValid: function() {
		return this.isValidChecksum();
	},
	isSupportedType: function() {
		var type = this.getType();
		var supp = this.getSupportedTypes().join(' ');
		return (' ' + supp + ' ').indexOf(' ' + type + ' ') > -1;
	},
	isValidFormat: function() {
		if (!this.isSupportedType()) {
			return false;
		}
		return this.raw.match(this.matcher15) || this.raw.match(this.matcher16);
	},
	isValidChecksum: function() {
		if (!this.isValidFormat()) {
			return false;
		}
		var digits = this.toValue();
		var i = 0, sum = 0;
		while (i < digits.length) {
			sum += ((i % 2) == 0 ? 2 : 1) * parseInt(digits[i++], 10);
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
	toValue: function() {
		return this.raw.replace(/\D/g, '');
	},
	getType: function() {
		// not intended to validate number, just guess what card type user
		// is trying to use by looking at known prefixes
		var m = this.raw.match(/^(34|35|36|37|4|5|6011)/);
		if (m) {
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


DataString.Dollars = DataString.createSubclass({
	isValid: function() {
		return this.raw.match(/^\$?\s*[\d,.-]+$/)
	},
	format: function(round) {
		return '$' + DataString._formatNumber(this.toValue(), round ? 0 : 2);
	},
	toValue: function() {
		return Number(this.raw.replace(/[^\d.-]/g, ''));
	},
	isAllowedChar: function(c) {
		return /[\d$.-]/.test(c);
	}
});

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
