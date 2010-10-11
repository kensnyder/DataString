<?php

/*
 * DataString JavaScript and PHP Library v%VERSION%
 * (c) 2010 Ken Snyder, MIT-style license
 * http://http://github.com/kensnyder/DataString
 *
 * The DataString class encapsulates a string to allow human-readable input and facilitate
 *   optimal human-readable formatting and machine-readable output
 */
class DataString {

	/**
	 * The raw and unformatted value of the data
	 * @var string
	 */
	public $raw;

	/**
	 * Current version of DataString
	 * @var string
	 */
	public static $version = '%VERSION%';

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
		return $this->valueOf() === $value->valueOf();
	}

	/**
	 * Create a clone of the current object
	 * @return DataString  copy of current object
	 */
	public function copy() {
		return clone $this;
	}

	/**
	 * Return true if the current raw value is in a known format
	 * @return bool
	 */
	public function isValid() {
		return true;
	}

	/**
	 * Return true if the current value is empty
	 * @return bool
	 */
	public function isEmpty() {
		return $this->raw === '';
	}

	/**
	 * Return a string in the most human-readable format possible
	 * @return string
	 */
	public function format() {
		return $this->raw;
	}

	/**
	 * Same as calling format() with no arguments. Allows casting object as string.
	 * @return string
	 */
	public function toString() {
		return $this->format();
	}

	/**
	 * Return a string in the most machine-readable format possible
	 * @return string
	 */
	public function valueOf() {
		return $this->raw;
	}

}