import {
  GET_CATEGORIES_DATA,
  UPDATE_FORM_VALUE,
  RESET_FILTERS_VALUE,
  UPDATE_FILE_VALUE,
} from '@/status-management/constants/store/main-filters/mutation-types';

export default {
  [GET_CATEGORIES_DATA](state, categories) {
    state.categories = categories;
  },

  [UPDATE_FORM_VALUE](state, { key, value }) {
    state.form[key] = value;
  },

  [RESET_FILTERS_VALUE](state, payload) {
    state.form = payload;
  },

  [UPDATE_FILE_VALUE](state, payload) {
    state.file = payload;
  },
};
