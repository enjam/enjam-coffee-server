"use strict";

function randomEntry(arr){
  return arr[Math.floor(Math.random() * arr.length)];
}

function slowPatternSubmit(){
  return randomEntry([
    "Hurtigere næste gang..",
    "Tiden løb ud..",
    "zzz..",
  ]);
}

function wrongPattern(){
  return randomEntry([
    "Forkert mønster..",
    "Har du vendt mønsteret på hovedet?",
    "Har du spejlvendt mønsteret?",
    "Var det det rigtige mønster?",
  ]);
}

function dispenseError(){
  return randomEntry([
    "Kaffen sidder fast i maskinen..",
    "Noget gik galt, prøv igen..",
    "Er kaffemaskinen tændt?",
    "Tandhjulet sidder fast..",
  ]);
}

function dispenseSuccess(){
  return randomEntry([
    "Hav en god dag!",
    "Vi ses til IoTjam d. 29. sep - 1. okt!",
    "Pas på - kaffepulveret er varmt!",
    "Du er sød!",
    "Kom igen i morgen!",
  ]);
}

module.exports = {
  wrongPattern,
  slowPatternSubmit,
  dispenseError,
  dispenseSuccess,
};
