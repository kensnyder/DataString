<?php

class DataString_Aba extends DataString {

	public function isValid() {
		$n = $this->format();
		// http://www.brainjar.com/js/validation/
		if (strlen($n) != 9 || $n == '000000000') {
			return false;
		}
		$sum = (
			($n[0] * 3) + ($n[1] * 7) + ($n[2] * 1) +
			($n[3] * 3) + ($n[4] * 7) + ($n[5] * 1) +
			($n[6] * 3) + ($n[7] * 7) + ($n[8] * 1)
		);
		return (($sum % 10) == 0);
	}

	public function format() {
		return preg_replace('/\D/', '', $this->raw);
	}

}