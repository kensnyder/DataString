<?php

$src = dirname(__FILE__) . '/../src';
$dist = dirname(__FILE__) . '/..';
$version = isset($_GET['v']) ? $_GET['v'] : '0.8.1';

$includes = array('Aba','Cc','Date','Number','Dollars','Email','Percent','PhoneUs10','Ssn','Url');
$php = file_get_contents("$src/DataString.php");
$js = file_get_contents("$src/DataString.js");

foreach ($includes as $include) {
	$php .= "\n" . preg_replace('/^<\?php/', '', file_get_contents("$src/DataString_$include.php"));
	$js .= "\n\n" . file_get_contents("$src/DataString.$include.js");
}

$jsBytes = file_put_contents("$dist/DataString.js", $js);
$phpBytes = file_put_contents("$dist/DataString.php", $php);

echo "Version $version. Wrote $jsBytes bytes to js, $phpBytes bytes to php.";
