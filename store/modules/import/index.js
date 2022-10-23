import actions from './actions';
import mutations from './mutations';
import getters from './getters';

const state = {
  file: null,
  columnsHandlers: [],

  form: {
    isStatus: {
      checked: false,
      reasonId: 0,
      comment: null,
    },

    isRock: {
      rock: null,
      level: null,
    },

    isPurchase: {
      comment: null,
      mainReasonId: null,
      auxiliaryReasonId: null,
      mainReason: null,
      auxiliaryReason: null,
    },
  },

  loading: false,
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
