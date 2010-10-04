/*
 * DataString JavaScript and PHP Library v%VERSION%
 * (c) 2010 Ken Snyder, MIT-style license
 * http://http://github.com/kensnyder/DataString
 */
(function(global) {

	// Helper Functions
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
	var symbolMap = {
		// first character is symbol, then shift+symbol
		// Unless labeled, browser specs are for Windows Vista
		// references:
		//   personal testing,
		//   http://unixpapa.com/js/key.html
		39: '\'"', // Op?
		42: '**', // Op10.62
		43: '==', // Op10.62
		44: ',<', // Op?
		45: '--', // Op10.62
		47: '//', // Op10.62
		61: '=+', // Op10.62
		78: '..', // Op10.62
		192: '`~', // FF3.6, S5, Ch6, Op10.62
		109: '-_', // FF3.6, Op10.62
		107: '=+', // FF3.6,  (Note: num pad + on some keyboards will be 107)
		219: '[{', // FF3.6, S5, Ch6, Op10.62
		221: ']}', // FF3.6, S5, Ch6, Op10.62
		220: '\\|', // FF3.6, S5, Ch6, Op10.62
		59: ';:', // FF3.6, S5, Ch6, Op10.62
		222: '\'"', // FF3.6, S5, Ch6, Op10.62
		186: ';:', // S5, Ch6
		187: '=+', // S5, Ch6
		188: ',<', // FF3.6, S5, Ch6, Op10.62
		189: '-_', // S5, Ch6
		190: '.>', // FF3.6, S5, Ch6, Op10.62
		191: '/?', // FF3.6, S5, Ch6, Op10.62
		111: '//', // FF3.6
		106: '**', // FF3.6, S5, Ch6
		110: '..' // FF3.6, S5, Ch6
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
			ascii = String.fromCharCode(kc)['to' + (evt.shiftKey ? 'Upper' : 'Lower') + 'Case']();
		}
		else if (kc >= 96 && kc <= 105) { // keypad digits
			ascii = "0123456789".charAt(kc-96);
		}
		else if ((ascii = symbolMap[kc])) { // symbols
			ascii = ascii.charAt(evt.shiftKey ? 1 : 0);
		}
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
console.log(evt.keyCode, evt.shiftKey, String.fromCharCode(evt.keyCode), c);
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