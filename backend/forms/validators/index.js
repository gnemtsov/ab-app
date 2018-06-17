'use strict';

//Booleans
module.exports.boolTrue = value => value;

//Strings
module.exports.strMinMax = (value, min, max) => value.length >= min && value.length <= max;
module.exports.strMax = (value, max) => value.length <= max;
module.exports.strEquals = (value, str) => value === str;
module.exports.strIsDate = (value) => Date.parse(value) !== NaN;

//Numbers
module.exports.numType = value => /^-?[0-9]*$/.test(value);
module.exports.numMinMax = (value, min, max) => value >= min && value <= max;
module.exports.numMin = (value, min) => value >= min;
module.exports.numMax = (value, max) => value <= max;
