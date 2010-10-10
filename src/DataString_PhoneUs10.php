<?php

class DataString_PhoneUs10 extends DataString {

	public $matcher = '/^1?\D*([2-9]\d{2})\D*([2-9]\d{2})\D*(\d{4})($|\D.*$)/';

	public function isValid() {
		return preg_match($this->matcher, $this->raw, $m) && $m[2] != '555';
	}

	public function format() {
		return preg_replace($this->matcher, '($1) $2-$3$4', $this->raw);
	}

	public function valueOf() {
		return preg_replace($this->matcher, '$1$2$3', $this->raw);
	}
	
}