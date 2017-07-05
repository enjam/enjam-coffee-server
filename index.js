var fs = require('fs'),
https = require('https'),
express = require('express'),
bodyParser = require('body-parser'),
request = require('request'),
app = express();

var firebase = require('firebase-admin');
var serviceAccount = require('/home/deploy/serviceAccountKey.json');


app.use(bodyParser.json());

https.createServer({
  key: fs.readFileSync('/etc/letsencrypt/live/enjam-drop.enjam.dk/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/enjam-drop.enjam.dk/fullchain.pem')
}, app).listen(8080);


firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://enjam-coffee.firebaseio.com'
});
// [END initialize]


app.get('/', function (req, res) {

  res.header('Content-type', 'text/html');

  var uid = "user_id_x";
  // Fetch the user's score.
  var userRef = firebase.database().ref('/scores/' + uid);
  userRef.once('value').then(function(user) {
	  var score = user.val();
	  console.log("score: " + score);
	  res.send("Your score is: " + score);
  });

//  res.end();
});
app.get('/fb', function(req, res){
  return res.end(req.query['hub.challenge']);
});

app.post('/fb', function(req, res){
        req.body.entry[0].changes.forEach(change => {
		console.log(change.value);
                if(change.value.item == "like"){
                        if(change.value.verb == "remove"){
                                console.log("Remove like");
//                                request.post(
//                                    'https://api.particle.io/v1/devices/2b0022000b51353432383931/ControlLed?access_token=12a39af71dcaba2d549d8b7a07cf5654b0c9a42b',
//                                    { form: {'args':'off'} },
//                                    function (error, response, body) {
//                                        if (!error && response.statusCode == 200) {
//                                            console.log(body)
//                                        }
//                                    }
//                                );
                        }

                        if(change.value.verb == "add"){
                                request.post(
                                    'https://api.particle.io/v1/devices/560037000c51353432383931/ControlCoff?access_token=613c364785f754069444090ecf4a2037eba69be2',
                                    { form: {'args':'on'} },
                                    function (error, response, body) {
                                        if (!error && response.statusCode == 200) {
                                            console.log(body)
                                        }
                                    }
                                );
				  var uid = change.value.user_id;
				  console.log("Userid " + uid + " liked something!");
				  var userRef = firebase.database().ref('/likes/' + uid);
				  userRef.set({
				    like:1
				  });

                                console.log("Add like");
                        }
                }
        });
        res.send("");
});


// curl --data "args=on" "https://api.particle.io/v1/devices/2b0022000b51353432383931/ControlLed?access_token=12a39af71dcaba2d549d8b7a07cf5654b0c9a42b"

