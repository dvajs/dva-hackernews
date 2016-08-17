import { put, call, select } from 'dva/effects';
import pathToRegexp from 'path-to-regexp';
import {
  fetchIdsByType,
  fetchItem,
  fetchItems,
  fetchUser,
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
      history.listen(({ pathname }, { params }) => {
        for (const type of ITEM_TYPES) {
          if (pathToRegexp(`/${type}/:page?`).test(pathname)) {
            dispatch({
              type: 'item/saveActiveType',
              payload: type,
            });
            dispatch({
              type: 'item/fetchList',
              payload: {
                type,
                page: params.page || 1,
              },
            });
          }
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
    *'item/fetchComments'({ payload }) {},
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
