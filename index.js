const fs = require('fs'),
      https = require('https'),
      express = require('express'),
      bodyParser = require('body-parser'),
      request = require('request'),
      app = express(),
      firebase = require('firebase-admin'),
      serviceAccount = require('/home/deploy/serviceAccountKey.json'),
      fb_interactions = require('./fb_interactions'),
      particle = require('./particle');

app.use(bodyParser.json());

https.createServer({
  key: fs.readFileSync('/etc/letsencrypt/live/enjam-drop.enjam.dk/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/enjam-drop.enjam.dk/fullchain.pem')
}, app).listen(8080);

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://enjam-coffee.firebaseio.com'
});



var ref = firebase.database().ref("/dispenser/user");

// Attach an asynchronous callback to read the data at our posts reference
ref.on("value", function(snapshot) {
  console.log(snapshot.val());
  particle.SetRandomPattern();
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
  console.log("body:");
  console.log(req.body);
  req.body.entry.forEach(entry => {
    entry.changes.forEach(change => {
      console.log(change);
      const val = change.value;
      const uid = val.user_id || val.sender_id;

      if(uid && val.item === "like" && !val.post_id){
        if (val.verb === "add"){
          fb_interactions.userAddedLikePage(uid);
        }else if(val.verb === "remove"){
          fb_interactions.userRemovedLikePage(uid);
        }
      }

      if (uid && val.item === "reaction" && val.post_id){
        if (val.verb === "add"){
          fb_interactions.userAddedReactionPost(uid, val.post_id, val.reaction_type);
        }else if(val.verb === "remove"){
          fb_interactions.userRemovedReactionPost(uid, val.post_id, val.reaction_type);
        }
      }

      if (uid && val.item === "comment" && val.post_id && val.verb === "add"){
        fb_interactions.userCommentedPost(uid, val.post_id, val.message);
      }

    })
  });
});
