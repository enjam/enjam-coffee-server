module.exports = {
  startCoffeeMaker
};

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
