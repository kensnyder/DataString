<?php

class DataString_Dollars extends DataString {

	public function isValid() {
		return preg_match('/^\$?\s*[\d,.-]+$/', $this->raw);
	}

	public function format($round = false) {
		return '$' . number_format($this->toValue(), $round ? 0 : 2);
	}

	public function toValue() {
		return (float) preg_replace('/[^\d.-]/', $this->raw);
	}

}