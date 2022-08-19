import {
  SET_LOADING,
  SET_PRODUCT_DATA,
  ADD_PRODUCT_COMMENT_VALUE,
} from '@/constants/store/product/mutation-types';

export default {
  [SET_PRODUCT_DATA](state, { key, data }) {
    state[key] = key === 'productLogs' ? Object.values(data) : data;
  },

  [SET_LOADING](state, payload) {
    state.loading = payload;
  },

  [ADD_PRODUCT_COMMENT_VALUE](state, { comment }) {
    const { userName: user, date, comment: text } = comment;

    state.productComments.push({ date, text, user });
  },
};
