const Firebase = require('firebase');

const api = new Firebase('https://hacker-news.firebaseio.com/v0');

function reject(error) {
  console.log('reject', error);
}

api.child('newstories').once('value', snapshot => {
  const val = snapshot.val();
  console.log(val);
  console.log(val.length);
}, reject);
