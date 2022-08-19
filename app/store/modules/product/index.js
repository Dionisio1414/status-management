import actions from './actions';
import mutations from './mutations';

const state = {
  productCharacteristics: [],
  productLogs: [],
  productComments: [],
  commentsGroups: {},

  loading: false,
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
