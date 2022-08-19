import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';

import productListModule from './modules/product-list';
import mainFiltersModule from './modules/main-filters';
import productModule from './modules/product';
import reasonsModule from './modules/reasons';

import { SET_LOADING } from '@/constants/store/mutation-types';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const store = new Vuex.Store({
  strict: debug,
  plugins: debug ? [createLogger()] : [],

  state: {
    loading: false,
  },

  mutations: {
    [SET_LOADING](state, payload) {
      state.loading = payload;
    },
  },

  modules: {
    productList: productListModule,
    mainFilters: mainFiltersModule,
    product: productModule,
    reasons: reasonsModule,
  },
});

export default store;
