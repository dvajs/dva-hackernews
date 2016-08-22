import pathToRegexp from 'path-to-regexp';
import { fetchUser } from '../../services/hn';

export default {
  namespace: 'user',
  state: {
    usersById: {},
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }, { params }) => {
        if (pathToRegexp('/user/:userId').test(pathname)) {
          dispatch({
            type: 'user/fetchUser',
            payload: params.userId,
          });
        }
      });
    },
  },
  effects: {
    *fetchUser({ payload: id }) {
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
