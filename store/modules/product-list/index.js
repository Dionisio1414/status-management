import actions from './actions';
import mutations from './mutations';

import { FIELDS_TABLE as fields } from '@/status-management/constants/fields-table.js';

const state = {
  products: [],
  productsCount: null,

  table: {
    params: {
      perPage: 50,
      page: 1,
    },

    selectedRows: [],
    fields,
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
