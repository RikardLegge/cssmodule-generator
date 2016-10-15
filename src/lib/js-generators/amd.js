export default function generateAmd(content, filePath){
  return `
define(${filePath}, function () {
    return ${content};
});`;
}