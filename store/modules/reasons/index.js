import actions from './actions';
import mutations from './mutations';

import { STATUS_REASONS } from '@/status-management/constants/reasons-list';

const state = {
  purchaseReasons: [],
  statusReasons: STATUS_REASONS,
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
