import { SET_REASONS_DATA } from '@/status-management/constants/store/reasons/mutation-types';

export default {
  [SET_REASONS_DATA](state, payload) {
    state.purchaseReasons = payload;
  },
};
