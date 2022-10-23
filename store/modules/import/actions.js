import ApiService from '@/status-management/services/api-service.js';

import { API_STARK_URL, JSON_CONTENT_TYPE } from '@/status-management/constants/api';

import {
  UPLOAD_FILE,
  UPDATE_BY_FILE,
  SET_COLUMN_HANDLER,
  REMOVE_COLUMN_HANDLER,
  UPDATE_FORM,
  RESET_FORM,
  RESET_COLUMN_HANDLERS,
} from '@/status-management/constants/store/import/action-types';
import {
  UPLOAD_FILE_VALUE,
  SET_COLUMNS_HANDLERS,
  UPDATE_COLUMNS_HANDLERS,
  UPDATE_FORM_VALUE,
  RESET_FORM_VALUE,
} from '@/status-management/constants/store/import/mutation-types';

import { GET_PRODUCTS } from '@/status-management/constants/store/product-list/action-types';

import { SET_LOADING } from '@/status-management/constants/store/mutation-types';

export default {
  async [UPLOAD_FILE]({ commit }, params) {
    try {
      commit(SET_LOADING, true);

      const data = await new ApiService(API_STARK_URL).uploadFile(params);

      commit(UPLOAD_FILE_VALUE, data);
      commit(SET_COLUMNS_HANDLERS, data?.file?.headers);
    } finally {
      commit(SET_LOADING, false);
    }
  },

  async [UPDATE_BY_FILE]({ commit, dispatch }, params) {
    try {
      commit(SET_LOADING, true);

      await new ApiService(API_STARK_URL, null, JSON_CONTENT_TYPE).updateByFile(
        params
      );

      await dispatch(`productList/${GET_PRODUCTS}`, null, {
        root: true,
      });
    } finally {
      commit(SET_LOADING, false);
    }
  },

  [SET_COLUMN_HANDLER]({ commit }, params) {
    commit(UPDATE_COLUMNS_HANDLERS, params);
  },

  [REMOVE_COLUMN_HANDLER]({ commit }, params) {
    commit(UPDATE_COLUMNS_HANDLERS, params);
  },

  [UPDATE_FORM]({ commit }, params) {
    commit(UPDATE_FORM_VALUE, params);
  },

  [RESET_FORM]({ commit }, params) {
    commit(RESET_FORM_VALUE, params);
  },

  [RESET_COLUMN_HANDLERS]({ commit, getters }) {
    commit(SET_COLUMNS_HANDLERS, getters.headersList);
  },
};
