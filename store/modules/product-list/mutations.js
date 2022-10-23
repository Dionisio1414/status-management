import cloneDeep from '@modules/lodash.clonedeep';

import {
  GET_PRODUCTS_DATA,
  UPDATE_TABLE_VALUE,
  UPDATE_PRODUCT_ITEM_VALUE,
} from '@/status-management/constants/store/product-list/mutation-types';

export default {
  [GET_PRODUCTS_DATA](state, { products, productsCount }) {
    state.products = Object.values(products || []);
    state.productsCount = productsCount;
  },

  [UPDATE_TABLE_VALUE](state, { key, value, isParams }) {
    if (isParams) {
      state.table.params[key] = value;
    } else {
      state.table[key] = value;
    }
  },

  [UPDATE_PRODUCT_ITEM_VALUE](state, { id, type, enable }) {
    const products = cloneDeep(state.products);

    if (typeof id === 'object') {
      products.forEach((item) => {
        if (id.includes(item.id)) {
          item[type === 'isStatus' ? 'status' : type] = Number(enable) ? 1 : 0;
        }
      });
    } else {
      const index = products.findIndex((product) => product.id === id);

      products[index][type === 'isStatus' ? 'status' : type] = Number(enable)
        ? 1
        : 0;
    }

    state.products = products;
  },
};
