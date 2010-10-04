<?php

class Quad_Data_Ss extends Quad_Data_Abstract {

	public $matcher = '/^(\d{3})\D*(\d{2})\D*(\d{4})$/';

	public function isValid() {
		$matchesOk = preg_match($this->matcher, $this->raw, $m);
		if (!$matchesOk) {
			return false;
		}
		// see http://www.socialsecurity.gov/history/ssn/geocard.html
		// and http://www.socialsecurity.gov/employer/stateweb.htm
		if ($m[1] == '000' || $m[2] == '00' || $m[3] == '0000') {
			return false;
		}
		// currently the highest area number (first 3 digits) is 733, but we allow higher
		return;
	}

	public function format() {
		if (preg_match($this->matcher, $this->raw, $m)) {
			return $m[1] . '-' . $m[2] .'-' . $m[3];
		}
		return $this->raw;
	}

	public function valueOf() {
		if (preg_match($this->matcher, $this->raw, $m)) {
			return $m[1] . $m[2] . $m[3];
		}
		return '';
	}

}