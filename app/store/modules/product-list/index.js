import actions from './actions';
import mutations from './mutations';

import { FIELDS_TABLE as fields } from '@/constants/fields-table.js';

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
    totalPages: null,
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
