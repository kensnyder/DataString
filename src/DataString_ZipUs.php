<?php

class DataString_ZipUs extends DataString {

	public $matcher = '^(\d{5})(:?-(\d{4}))$';

	public function isValid() {
		return preg_match($this->matcher, $this->raw);
	}

	public function valueOf() {
		if (!$this->isValid()) {
			return '';
		}
		preg_match($this->matcher, $this->raw, $m);
		return $m[1];
	}
	
}