import Firebase from 'firebase';

const api = new Firebase('https://hacker-news.firebaseio.com/v0');

function fetch (child) {
  return new Promise((resolve, reject) => {
    api.child(child).once('value', snapshot => {
      const val = snapshot.val();
      // mark the timestamp when this item is cached
      val.__lastUpdated = Date.now();
      resolve(val);
    }, reject);
  });
}

export async function fetchIdsByType(type) {
  return fetch(`${type}stories`);
}

export async function fetchItem(id) {
  return fetch(`item/${id}`);
}

export async function fetchItems(ids) {
  return Promise.all(ids.map(id => fetchItem(id)));
}

export async function fetchUser(id) {
  return fetch(`user/${id}`);
}

export async function watchList(type, cb) {
  let first = true;
  const ref = api.child(`${type}stories`);
  const handler = snapshot => {
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
