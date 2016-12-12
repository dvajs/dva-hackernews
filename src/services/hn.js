import Firebase from 'firebase';

const api = new Firebase('https://hacker-news.firebaseio.com/v0');

function fetch(child) {
  return new Promise((resolve, reject) => {
    api.child(child).once('value', (snapshot) => {
      const val = snapshot.val();
      if (val) {
        resolve(val);
      } else {
        // New items cannot be got so quickly.
        setTimeout(() => {
          fetch(child).then(val => resolve(val));
        }, 500);
      }
    }, reject);
  });
}

export function fetchIdsByType(type) {
  return fetch(`${type}stories`);
}

export function fetchItem(id) {
  return fetch(`item/${id}`);
}

export function fetchItems(ids) {
  return Promise.all(ids.map(id => fetchItem(id)));
}

export function fetchUser(id) {
  return fetch(`user/${id}`);
}

export function watchList(type, cb) {
  let first = true;
  const ref = api.child(`${type}stories`);
  const handler = (snapshot) => {
    if (first) {
      first = false;
    } else {
      cb(snapshot.val());
    }
  };
  ref.on('value', handler);
  return () => {
    ref.off('value', handler);
  }
}
