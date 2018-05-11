'use strict';

const length = (value, minLength, maxLength) => value.length >= minLength && value.length <= maxLength;

module.exports = {
	length: length,
	email: (value) => throw('Not implemented'),
	greaterOrEqual: (value, a) => value >= a,
	after: (value, date) => throw('Not implemented')
};
