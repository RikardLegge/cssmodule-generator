export default function CheapArray(array) {
  this.array = array;
  this.startCursor = 0;
  this.endCursor = array.length;
}
CheapArray.prototype.shift = function shift() {
  if (this.isAtEnd()) {
    debugger;
    throw "End of match not found";
  }

  var previous = this.first();
  this.startCursor++;
  return previous;
};
CheapArray.prototype.push = function push(item) {
  this.array[this.endCursor] = item;
  this.endCursor++;
};
CheapArray.prototype.pop = function pop() {
  var item = this.last();
  this.endCursor--;
  return item;
};
CheapArray.prototype.first = function current() {
  return this.array[this.startCursor];
};
CheapArray.prototype.last = function current() {
  return this.array[this.endCursor - 1];
};
CheapArray.prototype.isAtEnd = function isAtEnd() {
  return this.length() <= 0;
};
CheapArray.prototype.length = function length() {
  return this.endCursor - this.startCursor;
};
CheapArray.prototype.reverse = function reverse() {
  let length = this.length() / 2;
  let end = this.endCursor - 1;
  var array = this.array;
  for (let i = this.startCursor; i < length; i++) {
    [array[i], array[end - i]] = [array[end - i], array[i]];
  }
  return this;
};
CheapArray.prototype.getArray = function getArray() {
  return this.array.slice(this.startCursor, this.endCursor);
};
CheapArray.prototype.get = function getArray(index) {
  return this.array[this.startCursor + index];
};
