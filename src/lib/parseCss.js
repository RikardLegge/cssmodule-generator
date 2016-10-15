import CheapArray from './CheapArray';
import stringHash from 'string-hash';

const SELECTOR = /[a-z0-9_-]/i;

/**
 *
 * Creates an execution context for the parser and parses the source
 *
 * @param source string[]
 * @param options {{namespace: string, useHash: boolean}}
 * @returns {{string: Token[]}}
 */
export default function parseCss(source, options) {
  source = new CheapArray(source);
  var namespace = options.namespace || '';
  var useHash = options.useHash || false;
  var tokenMap = {};

  function cssSelector() {
    var start = source.startCursor + 1;
    var className = match(SELECTOR);
    var end = source.startCursor - 1;
    var hash = parseSelector();

    tokenMap[className] = tokenMap[className] || [];
    tokenMap[className].push({className, hash, namespace, start, end});

    return hash;
  }

  function cssComment() {
    source.shift();
    if (source.first() !== '*') {
      return;
    }
    source.shift();

    var i1 = 0;
    var i2 = 0;

    while (i1 !== i2 - 1 && !source.isAtEnd()) {
      parseToCharacter('*');
      i1 = source.startCursor;
      parseToCharacter('/');
      i2 = source.startCursor;
    }
  }

  function cssAtSymbol() {
    source.shift();
    parseToCharacter("}");
  }

  function singleQuoteString() {
    source.shift();
    parseToCharacter("'");
  }

  function doubleQuoteString() {
    source.shift();
    parseToCharacter('"');
  }


  function match(regex) {
    var buffer = '';
    var char = '';

    do {
      buffer += char;
      source.shift();
      char = source.first();
    } while (char.match(regex) && !source.isAtEnd());

    return buffer;
  }

  function parseToCharacter(character) {
    while (source.shift() !== character && !source.isAtEnd()){}
  }


  /**
   * .class { PARSING_CONTEXT }
   *
   * @returns string
   */
  function hashSelectorContent() {
    var content = '';
    outer:
    while (!source.isAtEnd()) {
      var token = source.first();

      switch (token) {
        case '}':
          source.shift();
          break outer;

        case '/':
          cssComment();
          break;
        case "'":
          singleQuoteString();
          break;
        case '"':
          doubleQuoteString();
          break;
        default:
          content += source.shift();
      }
    }

    var bareContent = content.replace(/\s|;/g, '');
    return stringHash(bareContent);
  }

  /**
   * .class { PARSING_CONTEXT }
   */
  function parseSelectorContent() {
    outer: while (!source.isAtEnd()) {
      var token = source.first();

      switch (token) {
        case '}':
          source.shift();
          break outer;

        case '/':
          cssComment();
          break;
        case "'":
          singleQuoteString();
          break;
        case '"':
          doubleQuoteString();
          break;
        default:
          source.shift();
      }
    }
  }

  /**
   * {.#}PARSING_CONTEXT {  }
   */
  function parseSelector() {
    while (!source.isAtEnd()) {
      var token = source.first();

      switch (token) {
        case '.':
          return cssSelector();
        case '#':
          return cssSelector();
        case '{':
          source.shift();
          if(useHash){
            return hashSelectorContent();
          } else {
            return parseSelectorContent();
          }

        case '/':
          cssComment();
          break;
        case "'":
          singleQuoteString();
          break;
        case '"':
          doubleQuoteString();
          break;
        default:
          source.shift();
      }
    }
  }

  /**
   * PARSING_CONTEXT {.# ...} { ... }
   */
  function rootParser() {
    while (!source.isAtEnd()) {
      var token = source.first();

      switch (token) {
        case '@':
          cssAtSymbol();
          break;
        case '.':
          cssSelector();
          break;
        case '#':
          cssSelector();
          break;
        case '/':
          cssComment();
          break;
        case "'":
          singleQuoteString();
          break;
        case '"':
          doubleQuoteString();
          break;
        default:
          source.shift();
      }
    }
    return tokenMap;
  }


  return rootParser();
}
