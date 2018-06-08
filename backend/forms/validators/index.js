'use strict';

module.exports.length = (value, minLength, maxLength) => (value.length >= minLength) && (value.length <= maxLength);

module.exports.activeWhite = (value) => value === 'white';

module.exports.active = (value) => value;

module.exports.typeNum = (value) => /^[1-9]{1}[0-9]*$/.test(value);

module.exports.countMin = (value, min) => value >= min;

module.exports.isDate = (value) => Date.parse(value) !== NaN;
