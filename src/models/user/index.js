import pathToRegexp from 'path-to-regexp';
import { fetchUser } from '../../services/hn';

export default {
  namespace: 'user',
  state: {
    usersById: {},
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/user/:userId').exec(pathname);
        if (match) {
          const userId = match[1];
          dispatch({
            type: 'fetchUser',
            payload: userId,
          });
        }
      });
    },
  },
  effects: {
    *fetchUser({ payload: id }, { call, put }) {
      yield put({ type: 'app/showLoading' });
      const user = yield call(fetchUser, id);
      yield put({
        type: 'saveUser',
        payload: user,
      });
      yield put({ type: 'app/hideLoading' });
    },
  },
  reducers: {
    saveUser(state, { payload: user }) {
      return { ...state, usersById: { ...state.usersById, [user.id]:user } };
    },
  },
}
