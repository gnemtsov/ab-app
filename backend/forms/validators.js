'use strict';

exposts.length = (value, minLength, maxLength) => value.length >= minLength && value.length <= maxLength;

exports.email = (value) => throw('Not implemented');

exports.greaterOrEqual = (value, a) => value >= a;

exports.after = (value, date) => throw('Not implemented');
