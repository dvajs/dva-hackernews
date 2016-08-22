
export default {

  namespace: 'app',

  state: {
    loading: false,
  },

  reducers: {
    ['showLoading'](state) {
      return { ...state, loading: true };
    },
    ['hideLoading'](state) {
      return { ...state, loading: false };
    },
  },

}
