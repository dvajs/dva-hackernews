import { call, put } from 'dva/effects';

export default {

  namespace: 'app',

  state: {
    loading: false,
  },

  reducers: {
    ['app/showLoading'](state) {
      return { ...state, loading: true };
    },
    ['app/hideLoading'](state) {
      return { ...state, loading: false };
    },
  },

}
