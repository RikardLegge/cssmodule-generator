import modulizeCss from './modulizeCss';
import generators from './js-generators/generators';
import fs from 'fs';
import Timer from "./timer";

const DefaultSubstitutionPattern = '{namespace}__{name}';
const DefaultNamespace = '';
const DefaultGeneratorName = 'es6';

export function generateUsingArgv(){

  var filePath = process.argv[2];
  if(filePath.indexOf('--help') !== -1){
    console.error(`${help()}`);
    return;
  }

  if(!fs.existsSync(filePath)){
    console.error(`File not found ${filePath}`);
    return;
  }

  var substitutionPattern = process.argv[3];
  if(!substitutionPattern){
    substitutionPattern = DefaultSubstitutionPattern;
    console.error(`No substitution pattern provided, using default: "${substitutionPattern}"`);
  }

  var namespace = process.argv[4] || '';
  if(!namespace){
    namespace =  DefaultNamespace;
    console.error(`No namespace provided, using default: "${namespace}"`);
  }

  var generatorName = process.argv[5];
  if(!generatorName){
    generatorName =  DefaultGeneratorName;
    console.error(`No generator provided, using default: "${generatorName}"`);
  }

  var generator = generators[generatorName];
  if(!generator){
    console.error(`No js generator with the name ${generatorName} is available
Try one of the following:\n${Object.keys(generators).join('\n')}`);
    return;
  }

  generate(filePath, substitutionPattern, namespace, generator);
}

function help(){
  return `CSS Module Generator
Usage: cssmodule-generator fileName {substitutionPattern} {namespace} {generator}

  substitutionPattern - The pattern to use for selector substitution, default: "${DefaultSubstitutionPattern}"
  namespace - The namespace to use in the substitution pattern, default: "${DefaultNamespace}"
  generator - The JavaScript model generator, default "${DefaultGeneratorName}"
`
}

function getFilePathNoExtention(filePath){
  var filePathParts = filePath.split('.');
  filePathParts.pop();
  return filePathParts.join('.');
}

function generate(filePath, substitutionPattern, namespace, generator){
  var rawCss = fs.readFileSync(filePath).toString();
  var filePathNoExt = getFilePathNoExtention(filePath);

  var timer = new Timer();
  var generated = modulizeCss(rawCss, {substitutionPattern, namespace, timers: timer.getTimers()});
  var content = JSON.stringify(generated.substitutions);

  fs.writeFileSync(`${filePathNoExt}.css.json`, content);
  fs.writeFileSync(`${filePathNoExt}.module.css`, generated.encodedCss);
  fs.writeFileSync(`${filePathNoExt}.css.js`, generator(content, filePathNoExt));

  console.log(`Created files: ${filePathNoExt}{.css.json, .module.css, .css.js} in ${timer.getDuration()}ms`);
}