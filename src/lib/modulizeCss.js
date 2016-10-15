import parseCss from './parseCss';
import CheapArray from './CheapArray';

var uniqueCounter = 0;

/**
 *
 * @param css
 * @param options {{timers: {}, namespace: string, substitutionPattern: string}}
 * @returns {{encodedCss, substitutions: {string:string}}}
 */
export default function modulizeCss(css, options={}) {
  var timers = options.timers || {};
  var namespace = options.namespace || '';
  var substitutionPattern = options.substitutionPattern || '{name}';
  var useHash = substitutionPattern.indexOf('{hash}') !== -1;

  timers.start = Date.now();

  var source = css.split('');
  timers.stringToArray = Date.now();

  var sourceCopy = source.slice();
  timers.arrayCopy = Date.now();

  var classes = parseCss(sourceCopy, {namespace, useHash});
  timers.parse = Date.now();

  var substitutions = useHash ? generateClassNameSubstitutions(Object.keys(classes).map((key)=>classes[key]), substitutionPattern) : {};
  timers.generateClassSubstitutions = Date.now();

  var tokenList = Object.keys(classes).reduce((classList, className)=> { return classList.concat(classes[className]); }, []);
  timers.generateClassList = Date.now();

  tokenList.sort((a, b)=>b.start - a.start);
  timers.sortClassesByPosition = Date.now();

  var cheapSource = replaceSelectors(source, tokenList, (node)=>substitutions[node.className] || generateSubstitution(node, substitutionPattern) );
  timers.replaceClassWithToken = Date.now();

  var target = cheapSource.getArray();
  timers.getArrayFromCheapArray = Date.now();

  target.reverse();
  timers.reverseArray = Date.now();

  var encodedCss = arrayToString(target);
  timers.arrayToString = Date.now();

  return {encodedCss, substitutions};
}

/**
 * A custom implementation of array.join('')
 *
 * @param array
 * @returns {string}
 */
function arrayToString(array){
  var str = '';

  for (let i = 0; i < array.length; i++) {
    str += array[i];
  }

  return str;
}

/**
 * Substitute the previous selectors with the ones generated by #generateSubstitution
 *
 * @param source string[]
 * @param bareTokenList Token[]
 * @param getSubstitution (Token)->string
 * @returns {CheapArray}
 */
function replaceSelectors(source, bareTokenList, getSubstitution){
  var target = new CheapArray(new Array(source.length));
  var tokenList = new CheapArray(bareTokenList);
  target.endCursor = 0;

  for (var i = source.length - 1; i >= 0; i--) {
    var token = tokenList.first();
    if (token && i === token.end) {
      var length = token.end - token.start;

      var substitution = getSubstitution(token);
      i -= length;

      for (var j = substitution.length - 1; j >= 0; j--) {
        target.push(substitution[j]);
      }
      tokenList.shift();
    } else {
      target.push(source[i]);
    }
  }

  return target;
}

/**
 * Generate an array of substitutions keyed by class name
 *
 * @param tokens Token[]
 * @param substitutionPattern string
 * @returns {{string: string}}
 */
function generateClassNameSubstitutions(tokens, substitutionPattern) {
  return tokens.reduce((classNameMap, tokenList)=> {
    var token = tokenList[0];
    classNameMap[token.className] = generateSubstitution(token, substitutionPattern);
    return classNameMap;
  }, {});
}

/**
 * Generate a substitution for the class or id selector
 *
 * @param token Token
 * @param substitutionPattern string
 * @returns {string}
 */
function generateSubstitution(token, substitutionPattern) {
  return substitutionPattern.replace(/{([^}]+)}/ig, (all, group)=> {
    switch (group) {
      case 'namespace':
        return token.namespace;
      case 'name':
        return token.className;
      case 'random':
        return 'r' + Math.random().toString(36).substring(7);
      case 'hash':
        return 'h' + (token.hash + 0.0).toString(36);
      case 'unique':
        return 'u' + (++uniqueCounter);
    }
  });
}