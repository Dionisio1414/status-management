<template>
  <b-container class="mb-4">
    <b-row>
      <b-col>
        <b-form
          class="d-flex align-items-center"
          style="gap: 2rem"
          @submit.prevent="submitFormHandler"
        >
          <multiselect
            id="searchBy"
            class="multiselect--ellipsis"
            :class="{ 'multiselect--error': $v.form.searchBy.$error }"
            :value="form.searchBy"
            :options="transformFieldsOptions"
            :searchable="false"
            :show-labels="false"
            :allow-empty="false"
            :disabled="loading"
            :custom-label="customLabelFields"
            placeholder="Выберите поле"
            @input="onChangeHandler({ key: 'searchBy', value: $event })"
          />

          <b-form-input
            id="search"
            class="form-control-default"
            size="lg"
            :state="$v.form.search.$error ? false : null"
            :value="form.search"
            :disabled="loading"
            placeholder="Input search value"
            @input="onChangeHandler({ key: 'search', value: $event.trim() })"
          />

          <multiselect
            id="genericArticleId"
            class="multiselect--ellipsis"
            :value="form.genericArticleId"
            :options="transformCategoriesListOptions"
            :searchable="true"
            :show-labels="false"
            :allow-empty="false"
            :disabled="loading"
            :custom-label="customLabelCategoriesList"
            placeholder="Select category"
            @input="onChangeHandler({ key: 'genericArticleId', value: $event })"
          />

          <multiselect
            id="isRock"
            class="multiselect--ellipsis"
            :value="form.isRock"
            :options="transformIsRockOptions"
            :searchable="false"
            :show-labels="false"
            :allow-empty="false"
            :disabled="loading"
            :custom-label="customLabelIsRock"
            placeholder="Неликвид"
            @input="onChangeHandler({ key: 'isRock', value: $event })"
          />

          <multiselect
            id="isSurcharge"
            class="multiselect--ellipsis"
            :value="form.isSurcharge"
            :options="transformSurchargeCheckedOptions"
            :searchable="false"
            :show-labels="false"
            :allow-empty="false"
            :disabled="loading"
            :custom-label="customLabelSurchargeChecked"
            placeholder="Большегруз"
            @input="onChangeHandler({ key: 'isSurcharge', value: $event })"
          />

          <multiselect
            id="isPurchase"
            class="multiselect--ellipsis"
            :value="form.isPurchase"
            :options="transformIsPurchaseOptions"
            :searchable="false"
            :show-labels="false"
            :allow-empty="false"
            :disabled="loading"
            :custom-label="customLabelIsPurchase"
            placeholder="К заказу"
            @input="onChangeHandler({ key: 'isPurchase', value: $event })"
          />

          <multiselect
            id="isPattern"
            class="multiselect--ellipsis"
            :value="form.isPattern"
            :options="transformIsPatternOptions"
            :searchable="false"
            :show-labels="false"
            :allow-empty="false"
            :disabled="loading"
            :custom-label="customLabelIsPattern"
            placeholder="Запонтентован"
            @input="onChangeHandler({ key: 'isPattern', value: $event })"
          />

          <b-button
            type="submit"
            :disabled="loading"
            class="btn--default"
            variant="success"
          >
            Search
          </b-button>

          <b-button
            :disabled="loading || !isChangeFilters"
            class="btn--default"
            variant="success"
            @click="resetFiltersHandler"
          >
            Reset filters
          </b-button>

          <b-button
            class="btn--default"
            variant="success"
            :disabled="loading"
            @click="exportProductsHandler"
          >
            Export
          </b-button>
        </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { saveAs } from 'file-saver';

import { validationMixin } from 'vuelidate';

import { requiredIf } from 'vuelidate/lib/validators';

import MixiMainFilter from '@/mixins/mixin-main-filter.js';

import {
  UPDATE_FORM,
  SUBMIT_FILTERS,
  RESET_FILTERS,
  EXPORT_PRODUCTS,
} from '@/constants/store/main-filters/action-types';

import { ALERT_EVENT_SHOW } from '@/constants/alert/alert-event-types';
import { SUCCESS, DANGER } from '@/constants/alert/alert-types';

export default {
  name: 'StatusManagementFilters',

  mixins: [MixiMainFilter, validationMixin],

  props: {
    loading: {
      type: Boolean,
      requried: true,
      default: false,
    },
  },

  validations: {
    form: {
      search: {
        required: requiredIf(function () {
          return Boolean(this.form.searchBy);
        }),
      },
      searchBy: {
        required: requiredIf(function () {
          return Boolean(this.form.search);
        }),
      },
    },
  },

  computed: {
    ...mapState('mainFilters', ['form', 'file']),

    isChangeFilters() {
      return Object.values(this.form).some((field) => field !== null);
    },
  },

  methods: {
    ...mapActions('mainFilters', [
      UPDATE_FORM,
      SUBMIT_FILTERS,
      RESET_FILTERS,
      EXPORT_PRODUCTS,
    ]),

    async exportProductsHandler() {
      try {
        await this[EXPORT_PRODUCTS]();

        this.downloadXlsxFile();

        this.$bus.$emit(ALERT_EVENT_SHOW, {
          variant: SUCCESS,
          show: true,
          content: 'Export was successfully',
        });
      } catch (error) {
        this.$bus.$emit(ALERT_EVENT_SHOW, {
          variant: DANGER,
          show: true,
          content: error?.message,
        });
      }
    },

    downloadXlsxFile() {
      const file = new Blob([this.file], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
      });

      saveAs(file, 'articles-sheet.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
      });
    },

    async submitFormHandler() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        try {
          await this[SUBMIT_FILTERS]();

          this.$v.$reset();

          this.$bus.$emit(ALERT_EVENT_SHOW, {
            variant: SUCCESS,
            show: true,
            content: 'Filter applied',
          });
        } catch (error) {
          this.$bus.$emit(ALERT_EVENT_SHOW, {
            variant: DANGER,
            show: true,
            content: error?.message,
          });
        }
      }
    },

    onChangeHandler(value) {
      this[UPDATE_FORM](value);
    },

    async resetFiltersHandler() {
      try {
        await this[RESET_FILTERS]();
        await this[SUBMIT_FILTERS]();

        this.$v.$reset();

        this.$bus.$emit(ALERT_EVENT_SHOW, {
          variant: SUCCESS,
          show: true,
          content: 'The filter has been reset',
        });
      } catch (error) {
        this.$bus.$emit(ALERT_EVENT_SHOW, {
          variant: DANGER,
          show: true,
          content: error?.message,
        });
      }
    },
  },
};
</script>
