'use strict';

var _benchmark = require('./benchmark');

var _benchmark2 = _interopRequireDefault(_benchmark);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var benchmarkResult = (0, _benchmark2.default)({ itt: 2000, minify: true, minifySrc: true, entropy: 2 });
var timing = benchmarkResult.timing;
var elapsedTime = benchmarkResult.generationTime + 'ms';
var characterCount = benchmarkResult.sourceCount;

console.log({ timing: timing, elapsedTime: elapsedTime, characterCount: characterCount });