const firebase = require('firebase-admin');

module.exports = {
  userLikedPage,
  userReactedPost,
};

function userLikedPage(uid){
  console.log("userLikedPage: " + uid);
}

function userReactedPost(uid, post_id, reaction_type){
  console.log("user: " + uid + ", " + reaction_type + " post: " + post_id);
}
