"use strict";

function randomIntInc (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

function leftPad (str, length) {
    str = str == null ? '' : String(str);
    length = ~~length;
    let pad = '';
    let padLength = length - str.length;

    while(padLength--)
      pad += '0';

    return pad + str;
}

function inArray(haystack, needle){
  return haystack.indexOf(needle) > -1;
}

function randomPattern() {
  var bits = new Array(3);
  var out = 0;
  var NewRandomNumber = randomIntInc(0,8);

  for(var i = 0; i < 3; i++){
    do {
      NewRandomNumber = randomIntInc(0,8);
    } while(inArray(bits, NewRandomNumber));

    bits[i] = NewRandomNumber
    var out1 = (1 << bits[i]);
    out |= out1;
  }

  return leftPad((out & 0x1FF).toString(2), 9);
}

module.exports = randomPattern;
