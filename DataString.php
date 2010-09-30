<?php

/**
 *
 */
class DataString {

	/**
	 * The raw and unformatted value of the data
	 * @var string
	 */
	public $raw;

	/**
	 * @param string $value  Any string-based data, especially input from user
	 */
	public function __construct($value = null) {
		$this->setValue($value);
	}

	/**
	 * Set the unformatted value of the data
	 * @param string $value  Any string-based data, especially input from user
	 * @return DataString  Returns current instance
	 */
	public function setValue($value = null) {
		$this->raw = trim($value);
		return $this;
	}

	/**
	 * Check if this value is the same as another string or DataString object
	 * @param string|DataString $value  Any string-based data, especially input from user
	 * @return bool
	 */
	public function equals($value) {
		if (!($value instanceof DataString)) {
			$bt = debug_backtrace();
			$className = $bt[0]['class'];
			$value = new $className($value);
		}
		return (string) $this === (string) $value;
	}

	public function copy() {
		$bt = debug_backtrace();
		$className = $bt[0]['class'];
		return new $className((string) $this);
	}

	public function isValid() {
		return true;
	}

	public function isEmpty() {
		return $this->raw === '';
	}

	public function format() {
		return $this->raw;
	}

	public function toString() {
		return $this->format();
	}

	public function toValue() {
		return $this->raw;
	}


}


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


class DataString_Cc extends DataString {

	public $matcher15 = '/^(\d{4})\D*(\d{6})\D*(\d{5})$/';
	public $matcher16 = '/^(\d{4})\D*(\d{4})\D*(\d{4})\D*(\d{4})$/';



}


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


class DataString_PhoneUs10 extends DataString {

	public $matcher = '/^1?\D*([2-9]\d{2})\D*([2-9]\d{2})\D*(\d{4})($|\D.*$)/';

	public function isValid() {
		return preg_match($this->matcher, $this->raw, $m) && $m[2] != '555';
	}

	public function format() {
		return preg_replace($this->matcher, '($1) $2$3$4', $this->raw);
	}

	public function toValue() {
		return preg_replace($this->matcher, '$1$2$3$4', $this->raw);
	}
	
}