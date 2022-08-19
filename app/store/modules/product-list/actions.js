import ApiService from '@/services/api-service.js';

import removeNullValues from '@/utils/remove-null-values.js';

import { API_STARK_URL, API_AJAX_PRODUCT_STARK_URL } from '@/constants/api';

import {
  GET_PRODUCTS,
  UPDATE_TABLE,
  REGENERATE_PRICE_PRODUCT,
  UPDATE_PRODUCT_ITEM,
} from '@/constants/store/product-list/action-types';
import {
  GET_PRODUCTS_DATA,
  UPDATE_TABLE_VALUE,
  UPDATE_PRODUCT_ITEM_VALUE,
} from '@/constants/store/product-list/mutation-types';
import { SET_LOADING } from '@/constants/store/mutation-types';

export default {
  async [GET_PRODUCTS]({ commit, state, rootState }) {
    try {
      const filterParams = removeNullValues(rootState.mainFilters.form);

      commit(SET_LOADING, true, { root: true });
      const { products } = await new ApiService(API_STARK_URL).getProducts({
        ...state.table.params,
        ...filterParams,
      });

      commit(GET_PRODUCTS_DATA, products);
    } finally {
      commit(SET_LOADING, false, { root: true });
    }
  },

  async [REGENERATE_PRICE_PRODUCT]({ commit }, id) {
    try {
      commit(SET_LOADING, true, { root: true });
      await new ApiService(API_AJAX_PRODUCT_STARK_URL).regenerateProductPrice(
        id
      );
    } finally {
      commit(SET_LOADING, false, { root: true });
    }
  },

  [UPDATE_PRODUCT_ITEM]({ commit }, data) {
    commit(UPDATE_PRODUCT_ITEM_VALUE, data);
  },

  [UPDATE_TABLE]({ commit }, payload) {
    commit(UPDATE_TABLE_VALUE, payload);
  },
};
