'use strict';

const length = (value, minLength, maxLength) => value.length >= minLength && value.length <= maxLength;
const email = (value) => throw('Not implemented');

module.exports = {
	length: length,
	email: email
};
