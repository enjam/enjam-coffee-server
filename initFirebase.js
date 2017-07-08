const firebase = require('firebase-admin');
const serviceAccount = require('/home/deploy/serviceAccountKey.json');

if (firebase.apps.length === 0) {
  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: 'https://enjam-coffee.firebaseio.com'
  });
}

module.exports = firebase;
