const firebase = require('firebase-admin');

module.exports = {
  userAddedLikePage,
  userRemovedLikePage,
  userAddedReactionPost,
  userRemovedReactionPost,
  userCommentedPost,
};

function setRefTrue(ref) {
  firebase.database().ref(ref).set(true);
}

function userAddedLikePage(uid){
  console.log("user added like page: " + uid);
  setRefTrue('pageLikes/'+uid);
}

function userRemovedLikePage(uid){
  console.log("user removed like page: " + uid);
}

function userAddedReactionPost(uid, post_id, reaction_type){
  console.log("user: " + uid + ", added " + reaction_type + " post: " + post_id);
  setRefTrue('postLikes/' + post_id + "/" + uid);
}

function userRemovedReactionPost(uid, post_id, reaction_type){
  console.log("user: " + uid + ", removed " + reaction_type + " post: " + post_id);
}

function userCommentedPost(uid, post_id, message) {
  console.log("user: " + uid + ", commented post: " + post_id + " with message: " + message);
  setRefTrue('postComment/' + post_id + '/' + uid);
}
