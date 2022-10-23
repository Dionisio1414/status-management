import cloneDeep from '@modules/lodash.clonedeep';

import ApiService from '@/status-management/services/api-service.js';
import removeNullValues from '@/status-management/utils/remove-null-values.js';

import {
  GET_PRODUCTS,
  UPDATE_TABLE,
} from '@/status-management/constants/store/product-list/action-types';
import {
  GET_CATEGORIES,
  UPDATE_FORM,
  SUBMIT_FILTERS,
  RESET_FILTERS,
  EXPORT_PRODUCTS,
} from '@/status-management/constants/store/main-filters/action-types';
import {
  GET_CATEGORIES_DATA,
  UPDATE_FORM_VALUE,
  RESET_FILTERS_VALUE,
  UPDATE_FILE_VALUE,
} from '@/status-management/constants/store/main-filters/mutation-types';

import { SET_LOADING } from '@/status-management/constants/store/mutation-types';

import { API_STARK_URL } from '@/status-management/constants/api';
import { DEFAULT_MAIN_FILTER } from '@/status-management/constants/default-main-filters';
import { DEFAULT_TABLE_PARAMS } from '@/status-management/constants/default-table-params';

export default {
  async [GET_CATEGORIES]({ commit }) {
    try {
      const categories = await new ApiService(API_STARK_URL).getCategories();

      commit(GET_CATEGORIES_DATA, categories);
    } catch (error) {
      throw new Error(error);
    }
  },

  async [SUBMIT_FILTERS]({ dispatch }) {
    try {
      await dispatch(
        `productList/${UPDATE_TABLE}`,
        cloneDeep(DEFAULT_TABLE_PARAMS),
        { root: true }
      );
      await dispatch(`productList/${GET_PRODUCTS}`, null, {
        root: true,
      });
    } catch (error) {
      throw new Error(error);
    }
  },

  async [RESET_FILTERS]({ commit, dispatch }) {
    await dispatch(
      `productList/${UPDATE_TABLE}`,
      cloneDeep(DEFAULT_TABLE_PARAMS),
      { root: true }
    );

    commit(RESET_FILTERS_VALUE, cloneDeep(DEFAULT_MAIN_FILTER));
  },

  async [EXPORT_PRODUCTS]({ commit, state }) {
    try {
      const params = removeNullValues(state.form);
      commit(SET_LOADING, true, { root: true });

      const data = await new ApiService(API_STARK_URL, 'blob').exportProducts(
        params
      );

      commit(UPDATE_FILE_VALUE, data);
    } finally {
      commit(SET_LOADING, false, { root: true });
    }
  },

  [UPDATE_FORM]({ commit }, payload) {
    commit(UPDATE_FORM_VALUE, payload);
  },
};
