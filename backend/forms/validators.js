'use strict';

module.exports.length = (value, minLength, maxLength) => value.length >= minLength && value.length <= maxLength;

module.exports.required = {
	params: ['value'],
	f: function(value) {
		return value !== '';
	}
}

module.exports.length = {
	params: ['value', 'minLength', 'maxLength'],
	f: function(value, minLength, maxLength) {
		return value.length >= minLength && value.length <= maxLength;
	}
}

module.exports.activeWhite = {
	params: ['value'],
	f: function(value) {
		return value === 'white';
	}
}

module.exports.active = {
	params: ['value'],
	f: function(value) {
		return value;
	}
}

module.exports.typeNum = {
	params: ['value'],
	f: function(value) {
		return /^[1-9]{1}[0-9]*$/.test(value);
	}
}

module.exports.countMin = {
	params: ['value', 'min'],
	f: function(value, min) {
		return value >= min;
	}
}
