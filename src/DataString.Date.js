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
		this.raw = date || '';
		this.date = undefined;
		if (this.raw.length) {
			var parser, i = 0;
			while ((parser = this.parsers[i++])) {
				if (!date.match(parser[0])) {
					continue;
				}
				this.date = new Date(Date.parse(date.replace(parser[0], parser[1])));
			}
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
		var day = this.date.getDate();
		return this.date.getFullYear() + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;
	},
	valueOf: function() {
		return this.date || '';
	}
});
