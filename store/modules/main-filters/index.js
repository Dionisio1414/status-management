import actions from './actions';
import mutations from './mutations';
import getters from './getters';

const state = {
  categories: [],
  file: null,

  form: {
    search: null,
    searchBy: null,
    genericArticleId: null,
    isRock: null,
    isSurcharge: null,
    isPurchase: null,
    isPattern: null,
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
