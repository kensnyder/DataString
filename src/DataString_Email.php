<?php

class DataString_Email extends DataString {
	
	public $matcher = '/^[^@]+@[^@]+$/';

	public function isValid() {
		return preg_match($this->matcher, $this->raw);
	}

}