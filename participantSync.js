const https = require('https');
const FB = require('fb');
const fbAccessToken = require('../fbAccessToken');
const firebase = require('./initFirebase');

const rootRef = firebase.database().ref();
const interestedRef = rootRef.child('interested');
const scoresRef = rootRef.child('scores');

function startParticipantSync(){
  FB.setAccessToken(fbAccessToken);

  function getAttending(){
    return new Promise((resolve, reject) => {
      FB.api(
        '/1748049711875959/attending',
        'GET', {}, res => {
          resolve(res.data);
        }
      );
    });
  }

  function getInterested(){
    return new Promise((resolve, reject) => {
      FB.api(
        '/1748049711875959/interested',
        'GET', {}, res => {
          resolve(res.data);
        }
      );
    });
  }

  function updateInterestedRef(){
    Promise.all([
      getAttending(),
      getInterested(),
      interestedRef.once('value'),
    ]).then(parr => {
      const ids = parr[0].concat(parr[1]).map(entry => entry.id);
      const regIds = Object.keys(parr[2].val() || {});
      const newIds = [];
      ids.forEach(id => {
        if (regIds.indexOf(id) === -1)
          newIds.push(id);
      });
      interestedRef.update(
        newIds.reduce((res, id) => {
          res[id] = true;
          return res;
        }, {})
      );
      newIds.forEach(id => {
        scoresRef.child(id).transaction(score => score + 10);
      });
    });
  }

  setInterval(updateInterestedRef, 10000);
}

module.exports = startParticipantSync;
