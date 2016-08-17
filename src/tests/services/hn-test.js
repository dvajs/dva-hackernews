import expect from 'expect';
import {
  fetchIdsByType,
  fetchItem,
  fetchItems,
  fetchUser,
  watchList,
} from '../../services/hn';

describe('services/hn', () => {

  it('fetchIdsByType', done => {
    fetchIdsByType('new').then(res => {
      expect(res.length).toEqual(500);
      done();
    });
  });

  it('fetchItem', done => {
    fetchItem('12298820').then(res => {
      expect(res.id).toEqual(12298820);
      expect(res.title).toEqual('Ask the ethicist: Should bots get a byline?');
      done();
    });
  });

  it('fetchItems', done => {
    fetchItems(['12298820', '12298817']).then(res => {
      expect(res[0].id).toEqual(12298820);
      expect(res.length).toEqual(2);
      done();
    });
  });

  // fetchItems(['12298820', '12298817'])
});
