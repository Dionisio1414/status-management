import { mapGetters } from 'vuex';

import {
  FILTER_LIST_FIELDS,
  FILTER_LIST_DEFAULT,
} from '@/constants/filters-list.js';

export default {
  data: () => ({
    fieldsOptions: FILTER_LIST_FIELDS,
    isRockOptions: FILTER_LIST_DEFAULT,
    surchargeCheckedOptions: FILTER_LIST_DEFAULT,
    isPurchaseOptions: FILTER_LIST_DEFAULT,
    isPatternOptions: FILTER_LIST_DEFAULT,
  }),

  computed: {
    ...mapGetters('mainFilters', ['categoriesList']),

    transformFieldsOptions() {
      return this.fieldsOptions.map((item) => item.value);
    },

    transformCategoriesListOptions() {
      return this.categoriesList.map((item) => item.value);
    },

    transformIsRockOptions() {
      return this.isRockOptions.map((item) => item.value);
    },

    transformSurchargeCheckedOptions() {
      return this.surchargeCheckedOptions.map((item) => item.value);
    },

    transformIsPurchaseOptions() {
      return this.isPurchaseOptions.map((item) => item.value);
    },

    transformIsPatternOptions() {
      return this.isPatternOptions.map((item) => item.value);
    },
  },

  methods: {
    customLabelFields(value) {
      const option = this.fieldsOptions.find((item) => item.value === value);

      return option.name ? `${option.name} - Поле` : '';
    },

    customLabelCategoriesList(value) {
      const option = this.categoriesList.find((item) => item.value === value);

      return option.name ? `${option.name} - Категория` : '';
    },

    customLabelgenericArticleId(value) {
      const option = this.fieldsOptions.find((item) => item.value === value);

      return option.name || '';
    },

    customLabelIsRock(value) {
      const option = this.isRockOptions.find((item) => item.value === value);

      return option.name ? `${option.name} - Неликвид` : '';
    },

    customLabelSurchargeChecked(value) {
      const option = this.surchargeCheckedOptions.find(
        (item) => item.value === value
      );

      return option.name ? `${option.name} - Большегруз` : '';
    },

    customLabelIsPurchase(value) {
      const option = this.isPurchaseOptions.find(
        (item) => item.value === value
      );

      return option.name ? `${option.name} - К заказу` : '';
    },

    customLabelIsPattern(value) {
      const option = this.isPatternOptions.find((item) => item.value === value);

      return option.name ? `${option.name} - Запонтентован` : '';
    },
  },
};
