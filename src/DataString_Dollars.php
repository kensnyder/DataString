<?php

class DataString_Dollars extends DataString_Number {

	public function format($round = false) {
		return '$' . number_format($this->toValue(), $round ? 0 : 2);
	}

}