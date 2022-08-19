import ApiService from '@/services/api-service.js';
import cloneDeep from 'lodash.clonedeep';

import {
  GET_PRODUCTS,
  UPDATE_TABLE,
} from '@/constants/store/product-list/action-types';
import {
  GET_CATEGORIES,
  UPDATE_FORM,
  SUBMIT_FILTERS,
  RESET_FILTERS,
} from '@/constants/store/main-filters/action-types';
import {
  GET_CATEGORIES_DATA,
  UPDATE_FORM_VALUE,
  RESET_FILTERS_VALUE,
} from '@/constants/store/main-filters/mutation-types';

import { API_STARK_URL } from '@/constants/api';
import { DEFAULT_MAIN_FILTER } from '@/constants/default-main-filters';
import { DEFAULT_TABLE_PARAMS } from '@/constants/default-table-params';

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

  [UPDATE_FORM]({ commit }, payload) {
    commit(UPDATE_FORM_VALUE, payload);
  },
};
