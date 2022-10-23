<template>
  <b-container class="mb-4">
    <b-row>
      <b-col>
        <b-form
          class="d-flex align-items-center"
          style="gap: 2rem"
          @submit.prevent="submitFormHandler"
        >
          <div class="multiselect-wrapper w-100">
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

            <button
              v-show="form.searchBy !== null"
              class="multiselect--clear"
              type="button"
              @click="onChangeHandler({ key: 'searchBy', value: null })"
            >
              <font-awesome-icon icon="times" />
            </button>
          </div>

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

          <div class="multiselect-wrapper w-100">
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
              @input="
                onChangeHandler({ key: 'genericArticleId', value: $event })
              "
            />

            <button
              v-show="form.genericArticleId !== null"
              class="multiselect--clear"
              type="button"
              @click="onChangeHandler({ key: 'genericArticleId', value: null })"
            >
              <font-awesome-icon icon="times" />
            </button>
          </div>

          <div class="multiselect-wrapper w-100">
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

            <button
              v-show="form.isRock !== null"
              class="multiselect--clear"
              type="button"
              @click="onChangeHandler({ key: 'isRock', value: null })"
            >
              <font-awesome-icon icon="times" />
            </button>
          </div>

          <div class="multiselect-wrapper w-100">
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

            <button
              v-show="form.isSurcharge !== null"
              class="multiselect--clear"
              type="button"
              @click="onChangeHandler({ key: 'isSurcharge', value: null })"
            >
              <font-awesome-icon icon="times" />
            </button>
          </div>

          <div class="multiselect-wrapper w-100">
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

            <button
              v-show="form.isPurchase !== null"
              class="multiselect--clear"
              type="button"
              @click="onChangeHandler({ key: 'isPurchase', value: null })"
            >
              <font-awesome-icon icon="times" />
            </button>
          </div>

          <div class="multiselect-wrapper w-100">
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
              placeholder="Запантентован"
              @input="onChangeHandler({ key: 'isPattern', value: $event })"
            />

            <button
              v-show="form.isPattern !== null"
              class="multiselect--clear"
              type="button"
              @click="onChangeHandler({ key: 'isPattern', value: null })"
            >
              <font-awesome-icon icon="times" />
            </button>
          </div>

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
import { mapActions, mapState } from '@modules/vuex';
import { saveAs } from '@modules/file-saver';
import { validationMixin } from '@modules/vuelidate';

import { library } from '@modules/@fortawesome/fontawesome-svg-core';
import { faTimes } from '@modules/@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@modules/@fortawesome/vue-fontawesome';

import { requiredIf } from '@modules/vuelidate/lib/validators';

import MixiMainFilter from '@/status-management/mixins/mixin-main-filter.js';

import {
  UPDATE_FORM,
  SUBMIT_FILTERS,
  RESET_FILTERS,
  EXPORT_PRODUCTS,
} from '@/status-management/constants/store/main-filters/action-types';

import { ALERT_EVENT_SHOW } from '@/status-management/constants/alert/alert-event-types';
import { SUCCESS, DANGER } from '@/status-management/constants/alert/alert-types';

library.add(faTimes);

export default {
  name: 'StatusManagementFilters',

  components: { FontAwesomeIcon },

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
