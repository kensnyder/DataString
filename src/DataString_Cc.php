<?php

class DataString_Cc extends DataString {

	public $matcher15 = '/^(\d{4})\D*(\d{6})\D*(\d{5})$/';
	public $matcher16 = '/^(\d{4})\D*(\d{4})\D*(\d{4})\D*(\d{4})$/';

	public function isValid() {
		return $this->isValidFormat() && $this->isValidChecksum() && $this->isSupportedType();
	}
	
	public function isSupportedType() {
		$type = $this->getType();
		$supp = $this->getSupportedTypes();
		return in_array($type, $supp);
	}

	public function isValidFormat() {
		return preg_match($this->matcher15, $this->raw) || preg_match($this->matcher16, $this->raw);
	}

	public function isValidChecksum() {
		$digits = $this->valueOf();
		$i = 0; $sum = 0;
		while ($i < strlen($digits)) {
			$sum += (($i % 2) == 0 ? 2 : 1) * (int) substr($digits, $i++, 1);
		}
		return ($sum % 10) == 0;
	}

	public function format($addMask = false) {
		if (preg_match($this->matcher16, $this->raw, $m)) {
			if ($addMask) {
				$m[1] = 'XXXX';
				$m[2] = 'XXXXXX';
				$m[3] = 'X' . substr($m, 1);
			}
			array_shift($m);
			return join('-', $m);
		}
		if (preg_match($this->matcher15, $this->raw, $m)) {
			if ($addMask) {
				$m[1] = $m[2] = $m[3] = 'XXXX';
			}
			array_shift($m);
			return join('-', $m);
		}
		return $this->raw;
	}

	public function valueOf() {
		return preg_replace('/\D/', '', $this->raw);
	}

	public function getType() {
		// not intended to validate number, just guess what card type user
		// is trying to use by looking at known prefixes
		if (preg_match('/^(34|35|36|37|4|5|6011)/', $this->raw, $m)) {
			switch ($m[1]) {
				case '6011': return 'disc';
				case '5':    return 'mc';
				case '4':    return 'visa';
			}
			return 'amex';
		}
	}

	public function getSupportedTypes() {
		return array('amex', 'mc', 'disc', 'visa');
	}

}