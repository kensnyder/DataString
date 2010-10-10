<?php

$begin = microtime(true);
$subclasses = array('Aba','Cc','Date','Number','Dollars','PhoneUs10','UrlAscii');

require_once(dirname(__FILE__) . "/src/DataString.php");
foreach ($subclasses as $sub) {
	require_once(dirname(__FILE__) . "/src/DataString_$sub.php");
}

?><!DOCTYPE html>
<html lang="en">
<head>
	<title>DataString Unit Tests</title>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<script type="text/javascript" src="lib/qunit/qunit.js"></script>
	<script type="text/javascript" src="src/DataString.js"></script>
	<?php foreach ($subclasses as $sub) { ?>
	<script type="text/javascript" src="src/DataString.<?php echo $sub?>.js"></script>
	<?php } ?>
	<link type="text/css" rel="stylesheet" href="lib/qunit/DataString.css" media="screen" />
</head>
<body>

<input type="text" name="cc" id="cc" value="4111111111111111" /><br />
<input type="text" name="bucks" id="bucks" value="123456.55" /><br />
<input type="text" name="bucks2" id="bucks2" value="bucks" /><br />
<div style="clear: both;"></div>

<div id="unit-output">
	<h1 id="qunit-header">DataString Unit Tests</h1>
	<h2 id="qunit-banner"></h2>
	<h2 id="qunit-userAgent"></h2>
	<ol id="qunit-tests"><li></li></ol>
</div>

<script type="text/javascript">

DataString.Cc.autoFormatInput('cc');
DataString.Dollars.autoFormatInput('bucks');
DataString.Dollars.keyMaskInput('bucks2')

String.prototype.getCheckdigit = function() {
	var i = 0, sum = 0;
	while (i < this.length) {
		sum += ((i % 2) == 0 ? 2 : 1) * parseInt(this.slice(i,1), 10);
		i++;
	}
	return 10 - (sum % 10);
}

function interpret(v) {
	return (typeof v == 'undefined' || v === null ? '' : 
		v === true ? '1' :
		v === false ? '0' :
		v
	);
}

with (QUnit) {

	<?php createAndInvoke("Number", "format", array(
		array('a','0'),
		array('a','0.0', 1),
		array('','0.000', 3),
		array('0','0'),
		array('-0','0'),
		array('-1','-1'),
		array('123.1234','123.12', 2),
		array('$123','123.00', 2),
	))?>

	<?php createAndInvoke("Dollars", "format", array(
		array('a','$0.00'),
		array('0','$0.00'),
		array('-0','$0.00'),
		array('-1','$-1.00'),
		array('123','$123.00'),
		array('$123','$123.00'),
		array('$1123','$1,123.00'),
		array('$1,123','$1,123.00'),
		array('1234567.123','$1,234,567.12'),
	))?>

	<?php createAndInvoke("Aba", "isValid", array(
		array('','0'),
		array('123','0'),
		array('000000000','0'),
		array('123456789','0'),
		array('123456780','1'),
		array('325079554','1'),
	))?>

	<?php createAndInvoke("PhoneUs10", "isValid", array(
		array('','0'),
		array('123','0'),
		array('0000000000','0'),
		array('1234567890','0'),
		array('2002002000','1'),
		array('2005552000','0'),
		array('200-200-2000','1'),
		array('200-2002-000','0'),
		array('(200)200-2000','1'),
		array('1(200)200-2000','1'),
		array('(200)200-2000','1'),
		array('1-200-200-2000','1'),
		array('(200) 200-2000','1'),
		array('1 (200) 200-2000','1'),
		array('(200) 200-2000 x123','1'),
		array('(200) 200-2000 ext. 123','1'),
		array('(200) 200-2000 #123','1'),
	))?>

	<?php createAndInvoke("PhoneUs10", "valueOf", array(
		array('',''),
		array('123','123'),
		array('200-200-2000','2002002000'),
		array('200-2002-000','200-2002-000'),
		array('(200)200-2000','2002002000'),
		array('1(200)200-2000','2002002000'),
		array('(200)200-2000','2002002000'),
		array('1-200-200-2000','2002002000'),
		array('(200) 200-2000','2002002000'),
		array('1 (200) 200-2000','2002002000'),
		array('(200) 200-2000 x123','2002002000'),
		array('(200) 200-2000 ext. 123','2002002000'),
		array('(200) 200-2000 cell','2002002000'),
	))?>

	<?php createAndInvoke("PhoneUs10", "format", array(
		array('',''),
		array('123','123'),
		array('200-200-2000','(200) 200-2000'),
		array('200-2002-000','200-2002-000'),
		array('(200)200-2000','(200) 200-2000'),
		array('1(200)200-2000','(200) 200-2000'),
		array('(200)200-2000','(200) 200-2000'),
		array('1-200-200-2000','(200) 200-2000'),
		array('(200) 200-2000','(200) 200-2000'),
		array('1 (200) 200-2000','(200) 200-2000'),
		array('(200) 200-2000 x123','(200) 200-2000 x123'),
		array('(200) 200-2000 ext. 123','(200) 200-2000 ext. 123'),
		array('(200) 200-2000 cell','(200) 200-2000 cell'),
	))?>

	<?php createAndInvoke("Cc", "format", array(
		array('4111111111111111','4111-1111-1111-1111'),
		array('4111 1111 1111 1111','4111-1111-1111-1111'),
		array('4111-1111-1111-1111','4111-1111-1111-1111'),
		array('4111x1111x1111_1111','4111-1111-1111-1111'),
		array('371111111111119','3711-111111-11119'),
		array('3711 111111 11119','3711-111111-11119'),
	))?>

	<?php createAndInvoke("Cc", "valueOf", array(
		array('4111111111111111','4111111111111111'),
		array('4111 1111 1111 1111','4111111111111111'),
		array('4111-1111-1111-1111','4111111111111111'),
		array('4111x1111x1111_1111','4111111111111111'),
		array('371111111111119','371111111111119'),
		array('3711 111111 11119','371111111111119'),
	))?>

	<?php createAndInvoke("Cc", "isValid", array(
		array('4111-1111-1111-1111','1'),
		array('4111 1111 1111 1112','0'),
	))?>

	<?php createAndInvoke("Cc", "getType", array(
		array('341111111111112','amex'),
		array('351111111111111','amex'),
		array('361111111111110','amex'),
		array('371111111111119','amex'),
		array('4111111111111111','visa'),
		array('5111111111111119','mc'),
		array('6011111111111118','disc'),
		array('0011111111111111',''),
	))?>

	<?php createAndInvoke("Date", "format", array(
		array('2010-03-13','2010-03-13'),
		array('2010-3-13','2010-03-13'),
		array('3-13-2010','2010-03-13'),
		array('03-13-2010','2010-03-13'),
		array('3/13/2010','2010-03-13'),
		array('03/13/2010','2010-03-13'),
		array('13.3.2010','2010-03-13'),
		array('13.03.2010','2010-03-13'),
		array('13-Mar-2010','2010-03-13'),
		array('13-March-2010','2010-03-13'),
		array('March 13, 2010','2010-03-13'),
	))?>

	test('DataString.UrlAscii(value).getParts()', function() {
		var i = 0;
		function testParts(url, scheme, user, pass, host, port, path, query, fragment) {
			var parts = new DataString.UrlAscii(url).getParts();
			i++;
			if (parts) {
				equal(parts.scheme, scheme, 'js: ' + i + '. scheme in `' + url + '`');
				equal(parts.user, user, 'js: ' + i + '. user in `' + url + '`');
				equal(parts.pass, pass, 'js: ' + i + '. pass in `' + url + '`');
				equal(parts.host, host, 'js: ' + i + '. host in `' + url + '`');
				equal(parts.port, port, 'js: ' + i + '. port in `' + url + '`');
				equal(parts.path, path, 'js: ' + i + '. path in `' + url + '`');
				equal(parts.query, query, 'js: ' + i + '. query in `' + url + '`');
				equal(parts.fragment, fragment, 'js: ' + i + '. fragment in `' + url + '`');
			}
			else {
				ok(false, i + '. scheme and or host not found in url `' + url + '`');
			}
		}
		var url;

		url  = 'http://host';
		testParts(url, 'http', false, false, 'host', false, false, false, false);

		url = 'http://host.com';
		testParts(url, 'http', false, false, 'host.com', false, false, false, false);

		url = 'http://host.com/path/one/two/?query#fragment';
		testParts(url, 'http', false, false, 'host.com', false, 'path/one/two', 'query', 'fragment');

		url = 'http://user@host.com/path/one/two/?query=1#fragment';
		testParts(url, 'http', 'user', false, 'host.com', false, 'path/one/two', 'query=1', 'fragment');

		url = 'http://user:password@host.com:1234/path/one/two/?query=1&a=2#fragment';
		testParts(url, 'http', 'user', 'password', 'host.com', 1234, 'path/one/two', 'query=1&a=2', 'fragment');

		url = 'http://subdomain.domain-name.com?query=1+2';
		testParts(url, 'http', false, false, 'subdomain.domain-name.com', false, false, 'query=1+2', false);

		url = 'some string';
		equal(new DataString.UrlAscii(url).isValid(), false, 'invalid url');

		<?php
		function testParts($url, $scheme, $user, $pass, $host, $port, $path, $query, $fragment) {
			static $i;
			$i++;
			$ds = new DataString_UrlAscii($url);
			$parts = $ds->getParts();
			if ($parts) {
				echo 'equal("' . $parts->host . '","' . $host . "\",'php: $i. host in `$url`');\n";
			}
			else {
				echo "ok(false, '$i. scheme and or host not found in url `$url`');\n";
			}
		}

			$url  = 'http://host';
			testParts($url, 'http', false, false, 'host', false, false, false, false);

			$url = 'http://host.com';
			testParts($url, 'http', false, false, 'host.com', false, false, false, false);

			$url = 'http://host.com/path/one/two/?query#fragment';
			testParts($url, 'http', false, false, 'host.com', false, 'path/one/two', 'query', 'fragment');

			$url = 'http://user@host.com/path/one/two/?query=1#fragment';
			testParts($url, 'http', 'user', false, 'host.com', false, 'path/one/two', 'query=1', 'fragment');

			$url = 'http://user:password@host.com:1234/path/one/two/?query=1&a=2#fragment';
			testParts($url, 'http', 'user', 'password', 'host.com', 1234, 'path/one/two', 'query=1&a=2', 'fragment');

			$url = 'http://subdomain.domain-name.com?query=1+2';
			testParts($url, 'http', false, false, 'subdomain.domain-name.com', false, false, 'query=1+2', false);

			$url = 'some string';
			$ds = new DataString_UrlAscii($url);
			$valid = $ds->isValid() ? 'true' : 'false';
			echo "equal($valid, false, 'invalid url');\n";

		?>
	});

}

</script>

<p id="php-summary">PHP tests finished in <?php echo round((microtime(true) - $begin) * 1000)?>ms</p>

</body>
</html><?php


function createAndInvoke($subclass, $method, $inputOutputs) {
	$js = "test('DataString.$subclass(value).$method()', function() {\n";
	foreach ($inputOutputs as $no => $io) {
		@list ($input, $expectedOutput) = $io;
		$args = array_slice($io, 2);
		$strArgs = '';
		if (count($args)) {
			$strArgs = array();
			foreach ($args as $arg) {
				$strArgs[] = "\"$arg\"";
			}
			$strArgs = join(",",$strArgs);
		}
		$strArgsEsc = str_replace('"', '\\"', $strArgs);
		$jsLabel = ($no + 1) . ". DataString.$subclass(\\\"$input\\\").$method($strArgsEsc)";
		$phpLabel = ($no + 1) . ". DataString_$subclass(\\\"$input\\\")->$method($strArgsEsc)";
		$js .= "\t\tequal(interpret(new DataString.$subclass(\"$input\").$method($strArgs)), \"$expectedOutput\", \"$jsLabel\");\n";
		$class = "DataString_$subclass";
		$str = new $class($input);
		$actual = call_user_func_array(array($str,$method), $args);
		$actual = is_bool($actual) ? (int) $actual : $actual;
		$js .= "\t\tequal(\"$actual\", \"$expectedOutput\", \"$phpLabel\");\n";
	}
	$js .= "});";
	echo $js;
}