export default function generateCommonJs(content){
  return `exports = ${content};`;
}