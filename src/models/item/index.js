import { put, call, select } from 'dva/effects';
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

  subscriptions: [
    function({ dispatch, history }) {
      let activeType = null;
      let unwatchList = null;
      let page = null;

      function fetchList(type, _page = 1) {
        page = _page;
        dispatch({
          type: 'item/saveActiveType',
          payload: type,
        });
        dispatch({
          type: 'item/fetchList',
          payload: {
            type,
            page,
          },
        });
      }

      function doWatchList(type) {
        watchList(type, ids => {
          dispatch({
            type: 'item/saveList',
            payload: {
              type, ids
            },
          });
          dispatch({
            type: 'item/fetchList',
            payload: {
              type,
              page,
            },
          });
        });
      }

      history.listen(({ pathname }, { params }) => {
        for (const type of ITEM_TYPES) {
          if (pathToRegexp(`/${type}/:page?`).test(pathname)) {
            // fetch
            fetchList(type, params.page);

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

    function({ dispatch, history }) {
      history.listen(({ pathname }, { params }) => {
        if (pathToRegexp(`/item/:itemId`).test(pathname)) {
          dispatch({
            type: 'item/fetchComments',
            payload: params.itemId,
          });
        }
      });
    },
  ],

  effects: {
    *'item/fetchList'({ payload }) {
      const { type, page } = payload;
      yield put({ type: 'app/showLoading' });

      const ids = yield call(fetchIdsByType, type);
      const itemsPerPage = yield select(state => state.item.itemsPerPage);
      const items = yield call(
        fetchItems,
        ids.slice(itemsPerPage * (page - 1), itemsPerPage * page)
      );
      yield put({ type: 'item/saveList', payload: { ids, type } });
      yield put({ type: 'item/saveItems', payload: items });

      yield put({ type: 'app/hideLoading' });
    },

    *'item/fetchComments'({ payload: id }) {
      yield put({ type: 'app/showLoading' });
      const item = yield call(fetchItem, id);
      yield put({ type: 'item/saveItems', payload: [item] });

      let ids = item.kids;
      while (ids && ids.length) {
        const items = yield call(fetchItems, ids);
        yield put({ type: 'item/saveItems', payload: items });
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
    'item/saveList'(state, { payload }) {
      const { ids, type } = payload;
      return { ...state, lists: { ...state.lists, [type]: ids } };
    },

    'item/saveItems'(state, { payload: itemsArr }) {
      const items = itemsArr.reduce((memo, item) => {
        memo[item.id] = item;
        return memo;
      }, {});
      return { ...state, itemsById: { ...state.itemsById, ...items }};
    },

    'item/saveActiveType'(state, { payload: activeType }) {
      return { ...state, activeType };
    },
  },
};
