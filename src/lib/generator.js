import modulizeCss from './modulizeCss';
import generators from './js-generators/generators';
import fs from 'fs';

export function generateUsingArgv(){
  var filePath = process.argv[2];
  var substitutionPattern = process.argv[3] || '{namespace}__{name}';
  var namespace = process.argv[4] || '';
  var generatorName = process.argv[5] || 'es6';
  var generator = generators[generatorName];

  if(!filePath){
    throw "No filepath provided";
  }

  if(!generator){
    throw `No js generator with the name ${generatorName} is available
Try one of the following: ${Object.keys(generators).join('\n')}`;
  }

  generate(filePath, substitutionPattern, namespace, generator);
}

function getFilePathNoExtention(filePath){
  var filePathParts = filePath.split('.');
  filePathParts.pop();
  return filePathParts.join('.');
}

function generate(filePath, substitutionPattern, namespace, generator){
  var rawCss = fs.readFileSync(filePath).toString();
  var filePathNoExt = getFilePathNoExtention(filePath);

  var generated = modulizeCss(rawCss, {substitutionPattern, namespace});
  var content = JSON.stringify(generated.substitutions);

  fs.writeFileSync(`${filePathNoExt}.css.json`, content);
  fs.writeFileSync(`${filePathNoExt}.module.css`, generated.encodedCss);
  fs.writeFileSync(`${filePathNoExt}.css.js`, generator(content, filePathNoExt));
}