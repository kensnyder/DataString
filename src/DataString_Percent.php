<?php

class DataString_Percent extends DataString_Number {

	public function format($precision = null) {
		if (!$this->isValid()) {
			return '';
		}
		$num = preg_replace('/[^\d.-]/', '', $this->raw);
		if ($precision !== null) {
			$num = number_format($num, $precision, '.', '');
		}
		return $num . '%';
	}

	public function valueOf() {
		$num = (float) preg_replace('/[^\d.-]/', '', $this->raw);
		return $num / 100;
	}

}