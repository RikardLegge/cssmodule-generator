var modulizeCss = require('./lib/modulizeCss').default;
var fs = require('fs');
var generators = {
  common: generateCommonJs,
  amd: generateAmd,
  es6: generateES6
};

var filePath = process.argv[2];
var substitutionPattern = process.argv[3] || '{namespace}__{name}';
var namespace = process.argv[4] || '';
var generatorName = process.argv[5] || 'es6';
var generator = generators[generatorName];

if(!generator){
  throw `No js generator with the name ${generatorName} is available`;
}

if(!filePath){
  throw "No filepath provided";
}

var rawCss = fs.readFileSync(filePath).toString();

var generated = modulizeCss(rawCss, {substitutionPattern, namespace});
var filePathNoExt = getFilePathNoExtention(filePath);

var content = JSON.stringify(generated.substitutions);

fs.writeFileSync(`${filePathNoExt}.css.json`, content);
fs.writeFileSync(`${filePathNoExt}.module.css`, generated.encodedCss);
fs.writeFileSync(`${filePathNoExt}.css.js`, generator(content));



function generateCommonJs(content){
  return `exports = ${content};`;
}

function generateAmd(content){
  return `
define(${filePathNoExt}, function () {
    return ${content};
});`;
}

function generateES6(content){
  return `exports default ${content};`;
}

function getFilePathNoExtention(filePath){
  var filePathParts = filePath.split('.');
  filePathParts.pop();
  return filePathParts.join('.');
}