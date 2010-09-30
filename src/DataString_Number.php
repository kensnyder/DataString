<?php

class DataString_Number extends DataString {

	public function isValid() {
		return preg_match('/^\$?\s*[\d,.-]+$/', $this->raw);
	}

	public function format($precision) {
		return '$' . number_format($this->toValue(), $precision);
	}

	public function toValue() {
		return (float) preg_replace('/[^\d.-]/', $this->raw);
	}

}