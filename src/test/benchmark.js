import modulizeCss from '../lib/modulizeCss';
import Timer from "../lib/timer";

export default function benchmark(options) {
  options = options || {};
  var itt = options.itt || 10;
  var minifySrc = !!options.minifySrc || false;
  var minify = !!options.minify || false;
  var entropy = options.entropy || 1;

  var timer = new Timer();
  var src = generateCss(itt, minifySrc, entropy);
  var substitutionPattern = minify ? '{unique}' : '{namespace}__{hash}__{name}';

  var localized = modulizeCss(src, {substitutionPattern, timers: timer.getTimers()});

  return {
    sourceCount: src.length,
    outputCount: localized.encodedCss.length,

    encodedCss: localized.encodedCss,
    substitutions: localized.substitutions,

    timing: timer.getRelativeTimers(),
    generationTime: timer.getDuration()
  }
}

function generateCss(itt, minifySrc, entropy) {

  var css = `
    .button {
  cursor: pointer; }
  .button[data-module=closeButton] {
    background: pink; }
    .button[data-module=closeButton][data-instance=red] {
      background: red; }

.link {
  font-weight: bold;
  text-decoration: underline;
  font-size: 20px; }

.menu {
  width: 400px;
  background: rgba(0, 0, 0, 0.15);
  position: relative;
  margin: 10px;
  display: flex; }
  .menu.menu--hidden {
    display: none; }
  .menu:after {
    content: "";
    display: block;
    clear: both; }
  .button__menu {
    float: left;
    width: 80px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    font-size: 12px;
    flex-grow: 1; }
    .button__menu.button--visible {
      display: block; }
    .button__menu .link__button {
      text-decoration: none; }
    .button__menu[data-module=linkButton] {
      text-decoration: underline; }
      .button__menu[data-module=linkButton][data-instance=rotate] .link__button {
        display: block;
        animation: spinLeft 1.5s ease infinite; }
    .button__menu[data-module=backButton][data-instance=rotate] .link__button {
      color: red;
      display: block;
      animation: spinRight 3s ease infinite; }
  .menu.{random}[data-instance=wide] {
    width: 600px; }
    .menu[data-instance=wide] .button__menu {
      height: 60px;
      line-height: 60px; }
      .menu[data-instance=wide] .button__menu[data-instance=invisible] {
        opacity: 0; }
      .menu[data-instance=wide] .button__menu[data-module=backButton] {
        background: blue;
        color: white; }
      .menu[data-instance=wide] .button__menu[data-module=closeButton] {
        background: black;
        color: white; }
      .menu[data-instance=wide] .button__menu[data-module=linkButton] {
        text-decoration: none; }
        .menu[data-instance=wide] .button__menu[data-module=linkButton][data-instance=rotate] .link__button {
          display: block;
          animation: spinRight 1.5s ease infinite; }

@keyframes spinRights {
  100% {
    transform: rotate(360deg); } }
@keyframes spinLefts {
  100% {
    transform: rotate(-360deg); } }

/*# sourceMappingURL=modulin.css.map */

`;


  var src = '';
  var str = minifySrc ? css.replace(/\s/g, '') : css;
  for (var i = 0; i < itt; i++) {
    src += str.replace(/\{random}/g, Math.random().toString(36).substring(2, 2 + entropy));
  }
  return src;
}