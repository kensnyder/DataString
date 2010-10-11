/*
 * DataString JavaScript and PHP Library v%VERSION%
 * (c) 2010 Ken Snyder, MIT-style license
 * http://http://github.com/kensnyder/DataString
 *
 * The DataString class encapsulates a string to allow human-readable input and facilitate
 *   optimal human-readable formatting and machine-readable output
 */
(function(global) {

	//
	// BEGIN Helper Functions
	//

	// extend an object with the property of another
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
	// get an element by id if not an element already
	function $(id) {
		return typeof id == 'string' ? document.getElementById(id) : id;
	}
	// map of Event#keyCode values for keydown events
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
	// get ascii value of keypress based on Event using Event#keyCode
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
//console.log(evt.keyCode, ascii);
		return ascii;
	}
	// add listeners for validating input, auto formatting or filtering
	//   keypresses on an <input>
	var listen = document.addEventListener ?
		function(element, type, callback) {
			element.addEventListener(type, callback, false);
		} :
		function(element, type, callback) {
			element.attachEvent("on" + type, callback);
		}
	;
	//
	// END helper functions
	//

	var staticProps = {
		/**
		 * Fire a callback when input value is invalid (on change or on blur)
		 * @param input {String|HTMLElement}  Id or reference to <input> element
		 * @param callback {Function}         Callback to fire when input value is invalid
		 * @return {HTMLElement}              The element observed
		 */
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
			return input;
		},
		/**
		 * On blur or change, automatically reformat input to the most human-readable format
		 * @param input {String|HTMLElement}  Id or reference to <input> element
		 * @param formatArgs {Array}          Array of arguments to pass to format() method
		 * @return {HTMLElement}              The element observed
		 */
		autoFormatInput: function(input, formatArgs) {
			input = $(input);
			var me = new this;
			function autoFormat() {
				me.raw = input.value;
				input.value = me.format.apply(me, formatArgs);
			}
			listen(input, 'blur', autoFormat);
			listen(input, 'change', autoFormat);
			return input;
		},
		/**
		 * Prevent keypress events for characters that are invalid for that format
		 * @param input {String|HTMLElement}  Id or reference to <input> element
		 * @return {HTMLElement}              The element observed
		 */
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
			return input;
		}
	};

	var instanceProps = {
		/**
		 * Current version of DataString
		 * @var {String}
		 */
		version: '%VERSION%',

		/**
		 * Set the unformatted value of the data
		 * @param {String} value  Any string-based data, especially input from user
		 * @return {DataString}   Returns current instance
		 */
		setValue: function(value) {
			this.raw = (typeof value == 'undefined' || value === null ? '' : value + '').replace(/^\s+/, '').replace(/\s+$/, '');
			return this;
		},
		
		/**
		 * Check if this value is the same as another string or DataString object
		 * @param {String|DataString} value  Any string-based data, especially input from user
		 * @return {Boolean}
		 */
		equals: function(value) {
			return this.valueOf() === (value instanceof DataString ? value : new this.constructor(value)).valueOf();
		},

		/**
		 * Create a clone of the current object
		 * @return {DataString}  copy of current object
		 */
		copy: function() {
			return new this(this.raw);
		},

		/**
		 * Return true if the current raw value is in a known format
		 * @return {Boolean}
		 */
		isValid: function() {
			return true;
		},

		/**
		 * Return true if the current value is empty
		 * @return {Boolean}
		 */
		isEmpty: function() {
			return this.raw === '';
		},

		/**
		 * Return a string in the most human-readable format possible
		 * @return string
		 */
		format: function() {
			return this.raw;
		},

		/**
		 * Same as calling format() with no arguments. Allows casting object as string.
		 * @return string
		 */
		toString: function() {
			return this.format();
		},

		/**
		 * Return a string in the most machine-readable format possible
		 * @return string
		 */
		valueOf: function() {
			return this.raw;
		},

		/**
		 * Return true if the passed character is allowed (used for keyMaskInput())
		 */
		isAllowedChar: function(c) {
			return true;
		}
	};

	//
	// BEGIN prototypal-inheritance system and class declaration
	//
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
	//
	// END prototypal-inheritance system and class declaration
	//

	// add static and instance methods
	DataString.createSubclass = createSubclass;
	extend(DataString, staticProps);
	extend(DataString.prototype, instanceProps);

	//
	// BEGIN public helper methods
	//
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
	//
	// END public helper methods
	//

	// assign to global
	global.DataString = DataString;

})(this);