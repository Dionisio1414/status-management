import Vue from '@modules/vue';

import {
  UPLOAD_FILE_VALUE,
  SET_COLUMNS_HANDLERS,
  UPDATE_COLUMNS_HANDLERS,
  UPDATE_FORM_VALUE,
  RESET_FORM_VALUE,
} from '@/status-management/constants/store/import/mutation-types';
import { SET_LOADING } from '@/status-management/constants/store/mutation-types';

export default {
  [UPLOAD_FILE_VALUE](state, payload) {
    state.file = payload;
  },

  [SET_COLUMNS_HANDLERS](state, payload) {
    const headers = Object.keys(payload || []);

    state.columnsHandlers = headers?.length
      ? new Array(headers.length).fill(null)
      : [];
  },

  [UPDATE_COLUMNS_HANDLERS](state, payload) {
    if (payload.action === 'set') {
      Vue.set(state.columnsHandlers, payload.index, payload.data);
    } else {
      state.columnsHandlers.splice(payload.index, 1, null);
    }
  },

  [UPDATE_FORM_VALUE](state, { key, field, value }) {
    state.form[key][field] = value;
  },

  [SET_LOADING](state, payload) {
    state.loading = payload;
  },

  [RESET_FORM_VALUE](state, { key, value }) {
    state.form[key] = value;
  },
};
