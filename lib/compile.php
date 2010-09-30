<?php

$src = dirname(__FILE__) . '/../src';
$dist = dirname(__FILE__) . '/..';

$includes = array('Aba','Cc','Dollars','PhoneUs10');
$php = file_get_contents("$src/DataString.php");
$js = file_get_contents("$src/DataString.js");

foreach ($includes as $include) {
	$php .= "\n" . preg_replace('/^<\?php/', '', file_get_contents("$src/DataString_$include.php"));
	$js .= "\n\n" . file_get_contents("$src/DataString.$include.js");
}

$jsBytes = file_put_contents("$dist/DataString.js", $js);
$phpBytes = file_put_contents("$dist/DataString.php", $php);

echo "Wrote $jsBytes bytes to js, $phpBytes bytes to php.";
