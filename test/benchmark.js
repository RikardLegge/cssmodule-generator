'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = benchmark;

var _modulizeCss = require('../lib/modulizeCss');

var _modulizeCss2 = _interopRequireDefault(_modulizeCss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function benchmark(options) {
  options = options || {};
  var itt = options.itt || 10;
  var minifySrc = !!options.minifySrc || false;
  var minify = !!options.minify || false;
  var entropy = options.entropy || 1;

  var src = generateCss(itt, minifySrc, entropy);
  var substitutionPattern = minify ? '{unique}' : '{namespace}__{hash}__{name}';
  var timers = {};

  var localized = (0, _modulizeCss2.default)(src, { substitutionPattern: substitutionPattern, timers: timers });

  var timerList = Object.keys(timers).map(function (name) {
    return { name: name, time: timers[name] };
  });
  timerList.sort(function (a, b) {
    return a.time - b.time;
  });
  var prevTime = timers.start;
  var diff = timerList.reduce(function (diff, timer) {
    var delta = timer.time - prevTime - 1;
    delta = delta < 0 ? 0 : delta;
    diff[timer.name] = delta;
    prevTime = timer.time;
    return diff;
  }, {});

  return {
    sourceCount: src.length,
    outputCount: localized.encodedCss.length,
    encodedCss: localized.encodedCss,
    substitutions: localized.substitutions,
    timing: diff,
    generationTime: timerList[timerList.length - 1].time - timerList[0].time
  };
}

function generateCss(itt, minifySrc, entropy) {

  var css = '\n    .button {\n  cursor: pointer; }\n  .button[data-module=closeButton] {\n    background: pink; }\n    .button[data-module=closeButton][data-instance=red] {\n      background: red; }\n\n.link {\n  font-weight: bold;\n  text-decoration: underline;\n  font-size: 20px; }\n\n.menu {\n  width: 400px;\n  background: rgba(0, 0, 0, 0.15);\n  position: relative;\n  margin: 10px;\n  display: flex; }\n  .menu.menu--hidden {\n    display: none; }\n  .menu:after {\n    content: "";\n    display: block;\n    clear: both; }\n  .button__menu {\n    float: left;\n    width: 80px;\n    height: 40px;\n    text-align: center;\n    line-height: 40px;\n    font-size: 12px;\n    flex-grow: 1; }\n    .button__menu.button--visible {\n      display: block; }\n    .button__menu .link__button {\n      text-decoration: none; }\n    .button__menu[data-module=linkButton] {\n      text-decoration: underline; }\n      .button__menu[data-module=linkButton][data-instance=rotate] .link__button {\n        display: block;\n        animation: spinLeft 1.5s ease infinite; }\n    .button__menu[data-module=backButton][data-instance=rotate] .link__button {\n      color: red;\n      display: block;\n      animation: spinRight 3s ease infinite; }\n  .menu.{random}[data-instance=wide] {\n    width: 600px; }\n    .menu[data-instance=wide] .button__menu {\n      height: 60px;\n      line-height: 60px; }\n      .menu[data-instance=wide] .button__menu[data-instance=invisible] {\n        opacity: 0; }\n      .menu[data-instance=wide] .button__menu[data-module=backButton] {\n        background: blue;\n        color: white; }\n      .menu[data-instance=wide] .button__menu[data-module=closeButton] {\n        background: black;\n        color: white; }\n      .menu[data-instance=wide] .button__menu[data-module=linkButton] {\n        text-decoration: none; }\n        .menu[data-instance=wide] .button__menu[data-module=linkButton][data-instance=rotate] .link__button {\n          display: block;\n          animation: spinRight 1.5s ease infinite; }\n\n@keyframes spinRights {\n  100% {\n    transform: rotate(360deg); } }\n@keyframes spinLefts {\n  100% {\n    transform: rotate(-360deg); } }\n\n/*# sourceMappingURL=modulin.css.map */\n\n';

  var src = '';
  var str = minifySrc ? css.replace(/\s/g, '') : css;
  for (var i = 0; i < itt; i++) {
    src += str.replace(/\{random}/g, Math.random().toString(36).substring(2, 2 + entropy));
  }
  return src;
}