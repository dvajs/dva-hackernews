import { put, call, select } from 'dva/effects';
import pathToRegexp from 'path-to-regexp';
import { fetchUser } from '../../services/hn';

export default {
  namespace: 'user',
  state: {
    usersById: {},
  },
  subscriptions: [
    function({ dispatch, history }) {
      history.listen(({ pathname }, { params }) => {
        if (pathToRegexp('/user/:userId').test(pathname)) {
          dispatch({
            type: 'user/fetchUser',
            payload: params.userId,
          });
        }
      });
    },
  ],
  effects: {
    *'user/fetchUser'({ payload: id }) {
      yield put({ type: 'app/showLoading' });
      const user = yield call(fetchUser, id);
      yield put({
        type: 'user/saveUser',
        payload: user,
      });
      yield put({ type: 'app/hideLoading' });
    },
  },
  reducers: {
    'user/saveUser'(state, { payload: user }) {
      return { ...state, usersById: { ...state.usersById, [user.id]:user } };
    },
  },
}
