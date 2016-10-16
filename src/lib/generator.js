import modulizeCss from './modulizeCss';
import jsGenerators from './js-generators/generators';
import Timer from "./timer";

import fs from 'fs';
import glob from 'glob';
import minimist from 'minimist';
import mkdirp from 'mkdirp';

const DefaultSubstitutionPattern = '{namespace}__{name}';
const DefaultNamespace = '';
const DefaultGeneratorName = 'es6';
const DefaultJsonGeneration = false;

export function generateUsingArgv() {
  var argv = minimist(process.argv.slice(2), {
    string: ['workningDirectory', 'pattern', 'modules', 'outDir', 'jsOutDir', 'cssOutDir', 'cssOutFile', 'namespace'],
    boolean: ['help', 'json', 'noJs', 'noCss', 'verbose'],
    alias: {
      'v': 'verbose',
      'h': 'help'
    }
  });

  var options = {
    substitutionPattern: argv.pattern || DefaultSubstitutionPattern,
    namespace: argv.namespace || DefaultNamespace,

    outDir: argv.outDir ? prepend(argv.workningDirectory)(argv.outDir) : argv.workningDirectory,
    jsOutDir: '',
    cssOutDir: '',
    jsonOutDir: '',
    inDirs: argv._.length > 0 ? argv._.map(prepend(argv.workningDirectory)) : invalidValue(`No input directory provided`),

    generateJson: argv.json,
    generateJs: !argv.noJs,
    generateCss: !argv.noCss,

    cssOutFile: argv.cssOutFile,

    jsGenerator: jsGenerators[argv.modules || DefaultGeneratorName]
  };

  options.jsGenerator || (options.generateJs = false);
  options.inDirs = options.inDirs.filter((dir)=>fs.existsSync(dir));

  options.jsOutDir = argv.jsOutDir ? prepend(argv.workningDirectory)(argv.jsOutDir) : options.outDir;
  options.jsonOutDir = argv.jsonOutDir ? prepend(argv.workningDirectory)(argv.jsonOutDir) : options.outDir;
  options.cssOutDir = argv.cssOutDir ? prepend(argv.workningDirectory)(argv.cssOutDir) : options.outDir;

  if(argv.verbose) {
    console.log('Running with options:');
    console.dir(options);
  }

  generate(options);
}

function prepend(str) {
  return function prepend(val) {
    return `${str}/${val}`;
  }
}

function invalidValue(errorDescription) {
  console.error(errorDescription);
  process.exit(1);
}

function getFilePathNoExtention(filePath) {
  var filePathParts = filePath.split('.');
  filePathParts.pop();
  return filePathParts.join('.');
}

function getPath(filePath) {
  var filePathParts = filePath.split('/');
  filePathParts.pop();
  return filePathParts.join('/');
}

function mapArrayValuesToStrings(map) {
  return Object.keys(map).reduce((subs, key)=> {
    subs[key] = map[key].join(' ');
    return subs;
  }, {})
}


function generate(options) {
  var timer = new Timer();
  var cssBuffer = [];

  var files = options.inDirs.reduce((fileList, dir)=> {
    var files = glob.sync("**/*.css", {cwd: dir}).map((file)=> {
      return {
        relativeFilePath: file,
        path: `${dir}/${file}`,
        namespace: getFilePathNoExtention(file).replace(/\//g, '_')
      }
    });
    return fileList.concat(files);
  }, []);

  files.forEach((file)=> {
    var rawCss = fs.readFileSync(file.path).toString();
    var generated = modulizeCss(rawCss, {
      substitutionPattern: options.substitutionPattern,
      namespace: options.namespace || file.namespace,
      timers: timer.getTimers()
    });

    if(options.generateCss) {
      if (options.cssOutFile) {
        cssBuffer.push(generated.encodedCss);
      } else {
        writeCss(file.relativeFilePath, generated.encodedCss);
      }
    }

    options.generateJs && writeJs(file.relativeFilePath, generated.substitutions);
    options.generateJson && writeJson(file.relativeFilePath, generated.substitutions);
  });

  if(options.generateCss && options.cssOutFile){
    writeCss(options.cssOutFile, cssBuffer.join('\n'), '.css');
  }

  function generateWriteContext(file, cb){
    var outPath = getPath(file);
    var outFileNoExt = getFilePathNoExtention(file);

    mkdirp(outPath, function (err) {
      if (err) {
        console.error(err);
        return;
      }
      cb(outFileNoExt);
    });
  }

  function writeJson(file, data) {
    generateWriteContext(`${options.jsonOutDir}/${file}`, (path)=>{
      var json = JSON.stringify(data);
      fs.writeFileSync(`${path}.css.json`, json);
    });
  }

  function writeJs(file, data) {
    generateWriteContext(`${options.jsOutDir}/${file}`, (path)=>{
      var json = JSON.stringify(mapArrayValuesToStrings(data));
      var js = options.jsGenerator(json, file);
      fs.writeFileSync(`${path}.css.js`, js);
    });
  }

  function writeCss(file, data, postfix='.module.css') {
    generateWriteContext(`${options.cssOutDir}/${file}`, (path)=>{
      fs.writeFileSync(`${path}${postfix}`, data);
    });
  }
}
