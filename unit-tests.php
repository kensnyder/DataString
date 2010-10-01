<?php

$begin = microtime(true);
$subclasses = array('Aba','Cc','Number','Dollars','PhoneUs10');

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
		sum += ((i % 2) == 0 ? 2 : 1) * parseInt(this[i++], 10);
	}
	return 10 - (sum % 10);
}

	with (QUnit) {

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
		)); ?>

		<?php createAndInvoke("Cc", "format", array(
			array('4111111111111111','4111-1111-1111-1111'),
			array('4111 1111 1111 1111','4111-1111-1111-1111'),
			array('4111-1111-1111-1111','4111-1111-1111-1111'),
			array('4111x1111x1111_1111','4111-1111-1111-1111'),
			array('371111111111119','3711-111111-11119'),
			array('3711 111111 11119','3711-111111-11119'),
		)); ?>

		<?php createAndInvoke("Cc", "isValid", array(
			array('4111-1111-1111-1111','1','good checksum ok'),
			array('4111 1111 1111 1112','0','bad checksum invalid'),
		)); ?>

		<?php /*createAndInvoke("Cc", "getType", array(
			array('341111111111112','amex'),
			array('351111111111111','amex'),
			array('361111111111110','amex'),
			array('371111111111119','amex'),
			array('4111111111111111','visa'),
			array('5111111111111119','mc'),
			array('6011111111111118','disc'),
			array('0011111111111111',''),
		)); */?>

	}

</script>

<p id="php-summary">PHP tests finished in <?php echo round((microtime(true) - $begin) * 1000)?>ms</p>

</body>
</html><?php


function createAndInvoke($subclass, $method, $inputOutputs) {
	$js = "test('DataString.$subclass', function() {";
	foreach ($inputOutputs as $no => $io) {
		@list ($input, $expectedOutput, $label) = $io;
		$jsLabel = ($no + 1) . '. ' . ($label ? "js - $label" : 'js');
		$phpLabel = ($no + 1) . '. ' . ($label ? "php - $label" : 'php');

		$js .= "equal(new DataString.$subclass(\"$input\").$method(), \"$expectedOutput\", \"$jsLabel\");\n";
		$class = "DataString_$subclass";
		$str = new $class($input);
		$actual = $str->$method();
		$js .= "equal(\"$actual\", \"$expectedOutput\", \"$phpLabel\");\n";
	}
	$js .= "});";
	echo $js;
}