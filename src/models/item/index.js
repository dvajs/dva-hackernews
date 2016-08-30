import pathToRegexp from 'path-to-regexp';
import {
  fetchIdsByType,
  fetchItem,
  fetchItems,
  watchList,
} from '../../services/hn';

const ITEM_TYPES = [
  'top', 'new', 'show', 'ask', 'job'
];

export default {

  namespace: 'item',

  state: {
    activeType: null,
    itemsPerPage: 20,
    lists: {
      top: [],
      new: [],
      show: [],
      ask: [],
      job: [],
    },
    itemsById: {},
  },

  subscriptions: {
    listSubscriber({ dispatch, history }) {
      let activeType = null;
      let unwatchList = null;
      let page = null;

      function fetchList(type, _page = 1) {
        page = _page;
        dispatch({
          type: 'saveActiveType',
          payload: type,
        });
        dispatch({
          type: 'fetchList',
          payload: {
            type,
            page,
          },
        });
      }

      function doWatchList(type) {
        watchList(type, ids => {
          dispatch({
            type: 'saveList',
            payload: {
              type, ids
            },
          });
          dispatch({
            type: 'fetchList',
            payload: {
              type,
              page,
            },
          });
        });
      }

      return history.listen(({ pathname }) => {
        for (const type of ITEM_TYPES) {
          const match = pathToRegexp(`/${type}/:page?`).exec(pathname);
          if (match) {
            const page = match[1];

            // fetch
            fetchList(type, page);

            // watch
            if (activeType !== type) {
              activeType = type;
              if (unwatchList) unwatchList();
              unwatchList = doWatchList(type);
            }
          }
        }
      });
    },

    itemSubscriber({ dispatch, history }) {
      return history.listen(({ pathname }, { params }) => {
        if (pathToRegexp(`/item/:itemId`).test(pathname)) {
          dispatch({
            type: 'fetchComments',
            payload: params.itemId,
          });
        }
      });
    },
  },

  effects: {
    *fetchList({ payload }, { put, call, select }) {
      const { type, page } = payload;
      yield put({ type: 'app/showLoading' });

      const ids = yield call(fetchIdsByType, type);
      const itemsPerPage = yield select(state => state.item.itemsPerPage);
      const items = yield call(
        fetchItems,
        ids.slice(itemsPerPage * (page - 1), itemsPerPage * page)
      );
      yield put({ type: 'saveList', payload: { ids, type } });
      yield put({ type: 'saveItems', payload: items });

      yield put({ type: 'app/hideLoading' });
    },

    *fetchComments({ payload: id }, { put, call }) {
      yield put({ type: 'app/showLoading' });
      const item = yield call(fetchItem, id);
      yield put({ type: 'saveItems', payload: [item] });

      let ids = item.kids;
      while (ids && ids.length) {
        const items = yield call(fetchItems, ids);
        yield put({ type: 'saveItems', payload: items });
        ids = items.reduce((memo, item) => {
          if (item.kids) {
            memo = [...memo, ...item.kids];
          }
          return memo;
        }, []);
      }

      yield put({ type: 'app/hideLoading' });
    },
  },

  reducers: {
    saveList(state, { payload }) {
      const { ids, type } = payload;
      return { ...state, lists: { ...state.lists, [type]: ids } };
    },

    saveItems(state, { payload: itemsArr }) {
      const items = itemsArr.reduce((memo, item) => {
        memo[item.id] = item;
        return memo;
      }, {});
      return { ...state, itemsById: { ...state.itemsById, ...items }};
    },

    saveActiveType(state, { payload: activeType }) {
      return { ...state, activeType };
    },
  },
};
