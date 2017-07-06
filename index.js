const fs = require('fs'),
      https = require('https'),
      express = require('express'),
      bodyParser = require('body-parser'),
      request = require('request'),
      app = express(),
      firebase = require('firebase-admin'),
      serviceAccount = require('/home/deploy/serviceAccountKey.json'),
      fb_interactions = require('./fb_interactions');

app.use(bodyParser.json());

https.createServer({
  key: fs.readFileSync('/etc/letsencrypt/live/enjam-drop.enjam.dk/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/enjam-drop.enjam.dk/fullchain.pem')
}, app).listen(8080);

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://enjam-coffee.firebaseio.com'
});

app.get('/', function (req, res) {
  res.header('Content-type', 'text/html');
  var uid = "user_id_x";
  var userRef = firebase.database().ref('/scores/' + uid);
  userRef.once('value').then(function(user) {
    var score = user.val();
    console.log("score: " + score);
    res.send("Your score is: " + score);
  });
});
app.get('/fb', function(req, res){
  return res.end(req.query['hub.challenge']);
});

app.post('/fb', function(req, res){
  res.status(200).send("").end();
  req.body.entry.forEach(entry => {
    entry.changes.forEach(change => {
      console.log(change);
      const val = change.val;
      const uid = val.user_id;

      if(val.item === "like" && val.verb === "remove" && !val.post_id){
        console.log("Remove like");
      }

      if(val.item === "like" && val.verb === "add" && !val.post_id){
        fb_interactions.userLikedPage(uid);
      }

      if (val.item === "reaction" && val.verb === "add" && val.post_id){
        fb_interactions.userReactedPost(uid, val.post_id, val.reaction_type);
      }

      if (val.item === "reaction" && val.verb === "remove" && val.post_id){
        fb_interactions.userReactedPost(uid, val.post_id, val.reaction_type);
      }
      /*
      var userRef = firebase.database().ref('/likes/' + uid);
      userRef.set({
        like:1
      });
      */
    })
  });
});
