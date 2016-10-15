import modulizeCss from './modulizeCss';
import generators from './js-generators/generators';
import fs from 'fs';
import Timer from "./timer";

const DefaultSubstitutionPattern = '{namespace}__{name}';
const DefaultNamespace = '';
const DefaultGeneratorName = 'es6';
const DefaultJsonGeneration = false;

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

  var json = process.argv[6] === 'true';
  !json && console.error(`Not generating JSON`);

  generate(filePath, substitutionPattern, namespace, generator, json, true, true);
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

function generate(filePath, substitutionPattern, namespace, generator, generateJSON, generateJs, generateCss){
  var rawCss = fs.readFileSync(filePath).toString();
  var filePathNoExt = getFilePathNoExtention(filePath);

  var timer = new Timer();
  var generated = modulizeCss(rawCss, {substitutionPattern, namespace, timers: timer.getTimers()});
  var jsonContent = JSON.stringify(generated.substitutions);
  var jsContent = JSON.stringify(Object.keys(generated.substitutions).reduce((subs, key)=>{subs[key] = generated.substitutions[key].join(' '); return subs;}, {}));

  generateCss && fs.writeFileSync(`${filePathNoExt}.module.css`, generated.encodedCss);
  generateJs && fs.writeFileSync(`${filePathNoExt}.css.js`, generator(jsContent, filePathNoExt));
  generateJSON && fs.writeFileSync(`${filePathNoExt}.css.json`, jsonContent);

  console.log(`Created files: ${filePathNoExt}{.css.json, .module.css, .css.js} in ${timer.getDuration()}ms`);
}