<?php

class DataString_Number extends DataString {

	public function isValid() {
		return preg_match('/^\$?\s*[\d,.-]+$/', $this->raw);
	}

	public function format($precision = null) {
		return number_format($this->valueOf(), $precision);
	}

	public function valueOf() {
		return (float) $this->raw;
	}

}