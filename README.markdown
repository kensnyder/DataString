# DataString

DataString provides equivalent classes in JavaScript and PHP to handle string-based data.

It aims to allow users to enter data in intuitive formats that are also easily manipulated by your programs. Take credit cards numbers for example:

	// JavaScript
	new DataString.Cc("4111 1111 1111 1111") + ""; // "4111111111111111"
	// PHP
	new DataString_Cc("4111 1111 1111 1111") . ""; // "4111111111111111"


Each subclass of DataString provides methods useful to validation such as isEmpty(), isValid() and equals(). Default formatting can be done by simply casting the object to string; the format() method may accept parameters.

The code is written to be very simple to allow line-by-line comparison of the JavaScript and PHP. The JavaScript implementation includes additional methods for observing input elements to autoformat, filter keystrokes or run a callback on invalid input.

A simple make script combines the source code into one .js and one .php file for easy inclusion in your project.

Unit tests in JS; PHP unit tests coming.