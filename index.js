"use strict";

const fs = require('fs'),
      https = require('https'),
      express = require('express'),
      bodyParser = require('body-parser'),
      request = require('request'),
      app = express(),
      firebase = require('./initFirebase'),
      fb_interactions = require('./fb_interactions'),
      randomPattern = require('./randomPattern'),
      userTexts = require('./userTexts'),
      config = require('./config'),
      particle = require('./particle');

app.use(bodyParser.json());

https.createServer({
  key: fs.readFileSync('/etc/letsencrypt/live/enjam-drop.enjam.dk/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/enjam-drop.enjam.dk/fullchain.pem')
}, app).listen(8080);

const rootRef = firebase.database().ref();
const scoresRef = rootRef.child('scores');
const dispenseCountRef = rootRef.child('dispenseCount');
const infoRef = rootRef.child('info');
const dispenserRef = rootRef.child('dispenser');
const dispenserUserRef = dispenserRef.child('user');
const dispenserStateRef = dispenserRef.child('state');
const userPatternRef = dispenserRef.child('userpattern');

let validationPattern;
let timeoutId;

dispenserStateRef.on('value', function(snap) {
  const state = snap.val();
  switch(state){
    
    case 'ready':
      if (timeoutId !== false){
        clearTimeout(timeoutId);
        timeoutId = false;
        particle.showValidationPattern(pattern.emptyPattern);
      }
      break;

    case 'requesting_access':
      validationPattern = randomPattern();
      particle.showValidationPattern(validationPattern);
      dispenserStateRef.set('awaiting_userpattern');
      timeoutId = setTimeout(() => {
        timeoutId = false;
        dispenserUserRef.once('value').then(snap => {
          const userId = snap.val();
          dispenserRef.set({state: 'ready'});
          infoRef.child(userId).set(userTexts.slowPatternSubmit());
          particle.clearValidationPattern();
        });
      }, config.timeToSubmitPattern);
      break;

    case 'validating_userpattern':
      if (timeoutId === false) return;
      clearTimeout(timeoutId);
      timeoutId = false;
      particle.clearValidationPattern();
      dispenserRef.once('value', snap => {
        const dispenser = snap.val();
        if (dispenser.userpattern === validationPattern){
          particle.dispenseCoffee();
          dispenserStateRef.set('dispensing');
          timeoutId = setTimeout(() => {
            dispenserRef.set({state: 'ready'});
            infoRef.child(dispenser.user).set(userTexts.dispenseError());
          }, config.timeToDispense);
        }else{
          infoRef.child(dispenser.user).set(userTexts.wrongPattern());
          dispenserRef.set({state:'ready'});
        }
      });
      break;
  }
});

//TODO: send dispense id to particle above and receive it in this webhook to ensure data integrity
app.get('/particle/coffeedone', (req, res) => {
  clearTimeout(timeoutId);
  dispenserUserRef.once('value', snap => {
    const userId = snap.val();
    //decrement score after dispensing
    scoresRef.child(userId).transaction(score => score - config.coffeePrice);
    //1 free coffee at 5 dispenses
    dispenseCountRef.child(userId).transaction(count => count + 1).then(obj => {
      const committed = obj.committed;
      const count = obj.snapshot.val();
      console.log('dispense transaction committed: ' + committed);
      console.log('snap val: ' + count);
      if (count == 5)
        return scoresRef.child(userId).transaction(score => score + 10);
    }).catch(e => {
      console.log(e);
    });
    infoRef.child(userId).set(userTexts.dispenseSuccess());
    dispenserRef.set({
      state: 'ready',
    });
  });
  res.send("");
});

app.get('/fb', (req, res) => res.send(req.query['hub.challenge']));

app.post('/fb', (req, res) => {
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
  res.send("");
});
