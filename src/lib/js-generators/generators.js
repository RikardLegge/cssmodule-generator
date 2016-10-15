var generateCommonJs = require('./commonjs').default;
var generateAmd = require('./amd').default;
var generateES6 = require('./es6').default;

export default {
  common: generateCommonJs,
  amd: generateAmd,
  es6: generateES6
};