import benchmark from './benchmark';

var benchmarkResult = benchmark({itt: 2000, minify: true, minifySrc: true, entropy: 2});
var timing = benchmarkResult.timing;
var elapsedTime = benchmarkResult.generationTime + 'ms';
var characterCount = benchmarkResult.sourceCount;

console.log({timing, elapsedTime, characterCount});
