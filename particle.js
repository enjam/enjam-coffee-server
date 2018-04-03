"use strict";

const request = require('request');

function dispenseCoffee() {
  request.post(
    'https://api.particle.io/v1/devices/560037000c51353432383931/ControlCoff?access_token=613c364785f754069444090ecf4a2037eba69be2',
    { form: {'args':'on'} },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        //console.log(body)
      }
    }
  );
}

function showValidationPattern (pattern){
  request.post(
    'https://api.particle.io/v1/devices/560037000c51353432383931/SetVerif?access_token=613c364785f754069444090ecf4a2037eba69be2',
    { form: {'args': pattern} },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        //console.log(body)
      }
    }
  );
}

function zpad(val){
  return ("000" + (val || 0)).substr(-3);
}

function addLights(color){
  console.log('adding lights: ', color);
  request.post(
    'https://api.particle.io/v1/devices/3c0056000f51353532343635/addLights?access_token=6306e24c54e1cb706220e16f8f984c9438071c4f',
    { form: {'args':zpad(color.r) + zpad(color.g) + zpad(color.b)}},
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        //console.log(body)
      }
    }
  );
}

function clearValidationPattern (pattern){
  showValidationPattern('0'.repeat(9));
}

module.exports = {
  showValidationPattern,
  dispenseCoffee,
  clearValidationPattern,
  addLights,
};
