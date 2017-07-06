module.exports = {
  SetRandomPattern
};

request = require('request'),


function startCoffeeMaker() {
  request.post(
    'https://api.particle.io/v1/devices/560037000c51353432383931/ControlCoff?access_token=613c364785f754069444090ecf4a2037eba69be2',
    { form: {'args':'on'} },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body)
      }
    }
  );
}

function randomIntInc (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}


function leftPad (str, length) {
    str = str == null ? '' : String(str);
    length = ~~length;
    pad = '';
    padLength = length - str.length;

    while(padLength--) {
        pad += '0';
    }

    return pad + str;
}


function inArray(haystack, needle){
  return haystack.indexOf(needle) > -1
}


function SetRandomPattern() {

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


  out = leftPad((out & 0x1FF).toString(2), 9);
  request.post(
    'https://api.particle.io/v1/devices/560037000c51353432383931/SetVerif?access_token=613c364785f754069444090ecf4a2037eba69be2',
    { form: {'args': out} },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        //console.log(body)
      }
    }
  );
}
