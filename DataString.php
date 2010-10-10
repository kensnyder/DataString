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

	public $matcher15 = '/^(\d{4})\D?(\d{6})\D?(\d{5})$/';
	public $matcher16 = '/^(\d{4})\D?(\d{4})\D?(\d{4})\D?(\d{4})$/';

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
		if (preg_match('/^(3[4-7]|4|5|6011)/', $this->raw, $m)) {
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


class DataString_Date extends DataString {
	//
	// A list of conversion patterns, each an array with two items
	//   where first item is regex and second is replacement string
	// Add, remove or splice a patterns to customize date parsing ability
	//
	// among others, DateTime constructor can safely handle:
	//   Mar 15, 2010
	//   March 15, 2010
	//   3/15/2010
	//   03/15/2010
	//
	//   pattern for year 1000 through 9999: ([1-9]\d{3})
	//   pattern for month number: (1[0-2]|0\d|\d)
	//   pattern for month name: (?:(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*)
	//   pattern for day of month: (3[01]|[0-2]\d|\d)
	public $parsers = array(
		// 3/15/2010
		array('/(1[0-2]|0\d|\d)\s*\/\s*(3[01]|[0-2]\d|\d)\s*\/\s*([1-9]\d{3})/', '$1/$2/$3'),
		// 2010-03-15
		array('/([1-9]\d{3})\s*-\s*(1[0-2]|0\d|\d)\s*-\s*(3[01]|[0-2]\d|\d)/', '$2/$3/$1'),
		// 3-15-2010
		array('/(1[0-2]|0\d|\d)\s*[\/-]\s*(3[01]|[0-2]\d|\d)\s*[\/-]\s*([1-9]\d{3})/', '$1/$2/$3'),
		// 15-Mar-2010
		array('/(3[01]|[0-2]\d|\d)\s*[ -]\s*(?:(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*)\s*[ -]\s*([1-9]\d{3})/i', '$2 $1, $3'),
		// March 15, 2010
		array('/(?:(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*)\s+(3[01]|[0-2]\d|\d),?\s*([1-9]\d{3})/i', '$2 $1, $3'),
		// 15.03.2010
		array('/(3[01]|[0-2]\d|\d)\s*\.\s*(1[0-2]|0\d|\d)\s*\.\s*([1-9]\d{3})/', '$2/$1/$3'),
	);
	
	public $date;
	
	public function setValue($date) {
		$this->date = null;
		foreach ($this->parsers as $parser) {
			if (!preg_match($parser[0], $date)) {
				continue;
			}
			$this->date = new DateTime(preg_replace($parser[0], $parser[1], $date));
		}
		return $this;
	}

	public function isValid() {
		return !!$this->date;
	}

	public function format() {
		if (!$this->isValid()) {
			return '';
		}
		return $this->date->format('Y-m-d');
	}

	public function valueOf() {
		return $this->date;
	}

}



class DataString_Number extends DataString {

	public function isValid() {
		return preg_match('/^-?[\d,]+(:?\.[\d]+)?%?$/', $this->raw);
	}	

	public function format($precision = null) {
		return number_format($this->valueOf(), $precision);
	}

	public function valueOf() {
		return (float) preg_replace('/[^\d.-]/', '', $this->raw);
	}

}


class DataString_Dollars extends DataString_Number {

	public function format($round = false) {
		return '$' . number_format($this->valueOf(), $round ? 0 : 2);
	}

	public function valueOf() {
		return (float) preg_replace('/[^\d.-]/', '', $this->raw);
	}

}


class DataString_Email extends DataString {
	
	public $matcher = '/^[^@]+@[^@]+$/';

	public function isValid() {
		return preg_match($this->matcher, $this->raw);
	}

}


class DataString_Percent extends DataString_Number {

	public function format($precision = null) {
		if (!$this->isValid()) {
			return '';
		}
		$num = preg_replace('/\D/', '', $this->raw);
		if ($precision !== null) {
			$num = number_format($num, $precision, '.', '');
		}
		return $num . '%';
	}

	public function valueOf() {
		$num = (float) preg_replace('/\D/', '', $this->raw);
		return $num / 100;
	}

}


class DataString_PhoneUs10 extends DataString {

	public $matcher = '/^1?\D*([2-9]\d{2})\D*([2-9]\d{2})\D*(\d{4})($|\D.*$)/';

	public function isValid() {
		return preg_match($this->matcher, $this->raw, $m) && $m[2] != '555';
	}

	public function format() {
		return preg_replace($this->matcher, '($1) $2-$3$4', $this->raw);
	}

	public function valueOf() {
		return preg_replace($this->matcher, '$1$2$3', $this->raw);
	}
	
}


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


class DataString_UrlAscii extends DataString {

	// we won't use parse_url because it returns info on invalid urls
	//   and we need to exactly match js
	public $matchers = array(
		'scheme' => '/^([a-z]+)\:/i',
		'user' => '/:\/\/([\w._+-]+)(?:\:|@)/',
		'pass' => '/:([\w._+-]+)@/',
		'host' => '/(?:@|\:\/\/)([\w.-]+)/',
		'host2' => '/@([\w.-]+)/',
		'port' => '/:(\d+)(?:\/|$)/',
		'path' => '/:\/\/[\w:@._+-]+\/([^?#]+)/',
		'query' => '/\?([^#]+)(?:#|$)/',
		'fragment' => '/#(.+)$/'
	);

	public function isValid() {
		return !!$this->getParts();
	}

	public function getParts() {
		$parts = new stdClass;
		foreach ($this->matchers as $part => $matcher) {
			if (preg_match($matcher, $this->raw, $m)) {
				$parts->$part = $m[1];
			}
			else {
				$parts->$part = false;
			}
		}
		if (!$parts->scheme || !$parts->host) {
			return false;
		}
		$parts->path = $parts->path ? rtrim($parts->path, '/') : false;
		if ($parts->pass == $parts->port) {
			$parts->pass = false;
		}
		if ($parts->user == $parts->host) {
			if (!preg_match($this->matchers['host2'], $this->raw, $m)) {
				return false;
			}
			$parts->host = $m[1];
		}
		return $parts;
	}


}