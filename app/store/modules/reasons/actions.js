import ApiService from '@/services/api-service.js';

import { API_STARK_URL } from '@/constants/api';
import { GET_PURSCHASE_REASONS } from '@/constants/store/reasons/action-types';
import { SET_REASONS_DATA } from '@/constants/store/reasons/mutation-types';

export default {
  async [GET_PURSCHASE_REASONS]({ commit }) {
    try {
      const data = await new ApiService(API_STARK_URL).getPurchaseReasons();

      commit(SET_REASONS_DATA, data);
    } catch (error) {
      throw new Error(error);
    }
  },
};
