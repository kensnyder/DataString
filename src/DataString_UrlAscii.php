<?php

class DataString_UrlAscii extends DataString {

	// we won't use parse_url because it returns info on invalid urls
	//   and we need to exactly match js
	public $matchers = array(
		'scheme' => '/^([a-z]+)\:/i',
		'user' => '/:\/\/([\w._+-]+)(?:\:|@)/',
		'pass' => '/:([\w._+-]+)@/',
		'host' => '/(?:@|\:\/\/)([\w.-]+)/',
		'host2' => '/@([\w.-]+)/',
		'port' => '/:(\d+)(?:\/|$)/',
		'path' => '/:\/\/[\w:@._+-]+\/([^?#]+)/',
		'query' => '/\?([^#]+)(?:#|$)/',
		'fragment' => '/#(.+)$/'
	);

	public function isValid() {
		return !!$this->getParts();
	}

	public function getParts() {
		$parts = new stdClass;
		foreach ($this->matchers as $part => $matcher) {
			if (preg_match($matcher, $this->raw, $m)) {
				$parts->$part = $m[1];
			}
			else {
				$parts->$part = false;
			}
		}
		if (!$parts->scheme || !$parts->host) {
			return false;
		}
		$parts->path = $parts->path ? rtrim($parts->path, '/') : false;
		if ($parts->pass == $parts->port) {
			$parts->pass = false;
		}
		if ($parts->user == $parts->host) {
			if (!preg_match($this->matchers['host2'], $this->raw, $m)) {
				return false;
			}
			$parts->host = $m[1];
		}
		return $parts;
	}


}