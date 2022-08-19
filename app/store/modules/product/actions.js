import ApiService from '@/services/api-service.js';

import parserIds from '@/utils/parser-ids';

import { API_STARK_URL, API_STARK_COMMENTS_URL } from '@/constants/api';
import {
  GET_PRODUCT_CHARACTERISTICS,
  GET_PRODUCT_LOGS,
  GET_PRODUCT_COMMENTS,
  UPDATE_PRODUCT,
  GET_COMMENTS_GROUPS,
  ADD_PRODUCT_COMMENT,
} from '@/constants/store/product/action-types';
import {
  SET_PRODUCT_DATA,
  SET_LOADING,
  ADD_PRODUCT_COMMENT_VALUE,
} from '@/constants/store/product/mutation-types';

import { UPDATE_PRODUCT_ITEM } from '@/constants/store/product-list/action-types';

export default {
  async [GET_PRODUCT_CHARACTERISTICS]({ commit }, id) {
    try {
      commit(SET_LOADING, true);
      const data = await new ApiService(
        API_STARK_URL
      ).getProductCharacteristics(id);

      commit(SET_PRODUCT_DATA, { key: 'productCharacteristics', data });
    } finally {
      commit(SET_LOADING, false);
    }
  },

  async [GET_PRODUCT_LOGS]({ commit }, id) {
    try {
      commit(SET_LOADING, true);

      const data = await new ApiService(API_STARK_URL).getProductLogs(id);

      commit(SET_PRODUCT_DATA, { key: 'productLogs', data });
    } finally {
      commit(SET_LOADING, false);
    }
  },

  async [GET_PRODUCT_COMMENTS]({ commit }, id) {
    try {
      commit(SET_LOADING, true);

      const data = await new ApiService(API_STARK_URL).getProductComments(id);

      commit(SET_PRODUCT_DATA, { key: 'productComments', data });
    } finally {
      commit(SET_LOADING, false);
    }
  },

  async [UPDATE_PRODUCT]({ commit, dispatch }, params) {
    try {
      commit(SET_LOADING, true);

      await new ApiService(API_STARK_URL).updateProduct(params);
      await dispatch(
        `productList/${UPDATE_PRODUCT_ITEM}`,
        {
          id: parserIds(params),
          type: params.get('type'),
          enable: params.get('enable'),
        },
        { root: true }
      );
    } finally {
      commit(SET_LOADING, false);
    }
  },

  async [GET_COMMENTS_GROUPS]({ commit }) {
    const data = await new ApiService(API_STARK_URL).getCommentsGroups();

    commit(SET_PRODUCT_DATA, { key: 'commentsGroups', data });
  },

  async [ADD_PRODUCT_COMMENT]({ commit }, params = {}) {
    try {
      commit(SET_LOADING, true);

      const data = await new ApiService(
        API_STARK_COMMENTS_URL
      ).addProductComment(params);

      commit(ADD_PRODUCT_COMMENT_VALUE, data);
    } finally {
      commit(SET_LOADING, false);
    }
  },
};
