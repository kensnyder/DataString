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

	public function valueOf() {
		return $this->raw;
	}


}