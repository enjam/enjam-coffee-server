"use strict";

function randomEntry(arr){
  return arr[Math.floor(Math.random() * arr.length)];
}

function slowPatternSubmit(){
  return randomEntry([
    "Sorry, I fell asleep. Please try again!",
    "Oops, the time ran out. Please try again!",
    "Try entering the pattern and pressing the 'coffee' button.",
  ]);
}

function wrongPattern(){
  return randomEntry([
    "Oops, wrong pattern. Please try again!",
    "Sorry, the pattern seems to be wrong. Please try again!",
    "Woops! You can find the pattern on the coffee machine.",
    "According to my assistant the pattern was not correct. Please try again.",
  ]);
}

function dispenseError(){
  return randomEntry([
    "Something went wrong. I'm sorry!",
    "Hmm.. That didn't work. Try again!",
    "That didn't work. Is the coffee machine on?",
    "That didn't work. Is the wheel stuck?",
  ]);
}

function dispenseSuccess(){
  return randomEntry([
    "Have a great day!",
    "See you the 29th of september!",
    "Watch out - the instant coffee is hot!",
    "I like you! Will you be back tomorrow?",
    "Have a nice day!",
  ]);
}

module.exports = {
  wrongPattern,
  slowPatternSubmit,
  dispenseError,
  dispenseSuccess,
};
