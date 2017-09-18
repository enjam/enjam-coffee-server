"use strict";

const firebase = require('./initFirebase');

const rootRef = firebase.database().ref();
const scoresRef = rootRef.child('scores');

function setRewardAndIncrement(obj){
  rootRef.child(obj.path).once('value').then(snap => {
    if (!snap.val()){
      console.log('Path not previously set: ' + obj.path);
      console.log('Setting path           : ' + obj.path);
      rootRef.child(obj.path).set(true);
      if (obj.points){
        console.log('adding to score transaction..');
        scoresRef.child(obj.uid)
          .transaction(score => score + obj.points)
          .catch(console.log);
      }
      if(obj.incrementPath){
        console.log('making increment transaction: ' + obj.incrementPath);
        rootRef.child(obj.incrementPath)
          .transaction(count => count + 1)
          .catch(console.log);
      }
    }
  }).catch(console.log);
}

function userAddedLikePage(uid){
  console.log("user added like page: " + uid);
  setRewardAndIncrement({
    path: 'pageLikes/' + uid,
    uid: uid,
    points: 10
  });
}

function userRemovedLikePage(uid){
  console.log("user removed like page: " + uid);
}

function userAddedReactionPost(uid, post_id, reaction_type){
  console.log("user: " + uid + ", added " + reaction_type + " post: " + post_id);
  setRewardAndIncrement({
    path: 'postLikes/' + post_id + '/' + uid,
    uid: uid,
    points: 5,
    incrementPath: 'postLikeCount/' + uid,
  });
}

function userRemovedReactionPost(uid, post_id, reaction_type){
  console.log("user: " + uid + ", removed " + reaction_type + " post: " + post_id);
}

function userCommentedPost(uid, post_id, message) {
  console.log("user: " + uid + ", commented post: " + post_id + " with message: " + message);
  setRewardAndIncrement({
    path: 'postComment/' + post_id + '/' + uid,
    uid: uid,
    points: 5,
    incrementPath: 'postCommentCount/' + uid,
  });
}

module.exports = {
  userAddedLikePage,
  userRemovedLikePage,
  userAddedReactionPost,
  userRemovedReactionPost,
  userCommentedPost,
};
