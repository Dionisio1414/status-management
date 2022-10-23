<template>
  <b-modal :id="modalName" :visible="show" static @hidden="closeHandler">
    <template #modal-header="{ close }">
      <div class="d-flex align-items-center w-100">
        <h3 class="modal-title" v-html="customProps.title" />
        <button
          type="button"
          style="font-size: 2rem"
          class="close"
          @click="close"
        >
          ×
        </button>
      </div>
    </template>

    <template #default="{ hide }">
      <b-overlay
        class="position-absolute"
        :class="{ 'b-overlay-wrap--loading': loading }"
        :show="loading"
      />

      <b-form
        id="form-rock"
        @submit.prevent="applyFormHandler(hide)"
        style="min-height: 24rem"
      >
        <b-form-group
          class="default-form-group"
          label="Наценка:"
          label-for="profit"
        >
          <b-input-group append="%">
            <b-form-input
              v-model.number="form.rock"
              type="number"
              id="profit"
              class="form-control-default"
              :state="$v.form.rock.$error ? false : null"
              :disabled="loading"
              placeholder="Наценка %"
            />
          </b-input-group>
        </b-form-group>

        <b-form-group
          class="default-form-group"
          label="Уровни:"
          label-for="levels"
        >
          <multiselect
            id="levels"
            v-model="form.level"
            :class="{ 'multiselect--error': $v.form.level.$error }"
            :options="levelsOptions"
            :searchable="false"
            :show-labels="false"
            :allow-empty="false"
            :disabled="loading"
            :custom-label="customLabelLevels"
            placeholder="Выберите уровень наценки"
          />
        </b-form-group>
      </b-form>
    </template>

    <template #modal-footer="{ hide }">
      <div class="d-flex align-items-center justify-content-between w-100">
        <b-button
          type="submit"
          form="form-rock"
          class="btn--default"
          variant="primary"
          :disabled="loading"
        >
          Apply
        </b-button>

        <b-button
          class="btn--default"
          variant="outline-secondary"
          :disabled="loading"
          @click="hide"
        >
          Cancel
        </b-button>
      </div>
    </template>
  </b-modal>
</template>

<script>
import { mapState, mapActions } from '@modules/vuex';

import { validationMixin } from '@modules/vuelidate';
import { required } from '@modules/vuelidate/lib/validators';

import { MODAL_CLOSE } from '@/status-management/constants/modals/modal-event-types';

import { UPDATE_PRODUCT } from '@/status-management/constants/store/product/action-types';

import { ALERT_EVENT_SHOW } from '@/status-management/constants/alert/alert-event-types';
import { SUCCESS, DANGER } from '@/status-management/constants/alert/alert-types';

import { UPDATE_TABLE } from '@/status-management/constants/store/product-list/action-types';

import { LEVELS_LIST } from '@/status-management/constants/levels-list';

export default {
  name: 'ModalRock',

  mixins: [validationMixin],

  validations: {
    form: {
      rock: { required },
      level: { required },
    },
  },

  props: {
    modalName: {
      type: String,
      required: true,
    },

    show: {
      type: Boolean,
      required: true,
    },

    customProps: {
      type: Object,
      required: true,
    },
  },

  data: () => ({
    form: {
      rock: null,
      level: null,
    },

    levelsList: LEVELS_LIST,
  }),

  computed: {
    ...mapState('product', {
      loading: (state) => state.loading,
    }),

    ...mapState('productList', {
      selectedRows: (state) => state.table.selectedRows,
    }),

    selectedRowsIds() {
      return (this.selectedRows || []).map((item) => item.id);
    },

    levelsOptions() {
      return this.levelsList.map((item) => item.id);
    },
  },

  methods: {
    ...mapActions('product', [UPDATE_PRODUCT]),
    ...mapActions('productList', [UPDATE_TABLE]),

    closeHandler(callback) {
      const typeCallback = callback.vueTarget
        ? callback.vueTarget.hide
        : callback;

      this.$bus.$emit(MODAL_CLOSE, typeCallback);
    },

    customLabelLevels(id) {
      const option = this.levelsList.find((item) => item.id === id);

      return option?.name || '';
    },

    async applyFormHandler(hideCallback) {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        try {
          const formData = new FormData();

          formData.append('type', this.customProps.type);
          formData.append('enable', this.customProps.checked ? 1 : 0);
          formData.append('rock', this.form.rock);
          formData.append('level', this.form.level);

          if (this.customProps.isMassUpdate) {
            this.selectedRowsIds.forEach((id) => {
              formData.append('id[]', id);
            });
          } else {
            formData.append('id', this.customProps.starkId);
          }

          await this[UPDATE_PRODUCT](formData);

          this.customProps.isMassUpdate &&
            (await this[UPDATE_TABLE]({
              key: 'selectedRows',
              value: [],
              isParams: false,
            }));

          this.$bus.$emit(ALERT_EVENT_SHOW, {
            variant: SUCCESS,
            show: true,
            content: 'Successfully updated product',
          });

          this.$v.$reset();
          hideCallback();
        } catch (error) {
          this.$bus.$emit(ALERT_EVENT_SHOW, {
            variant: DANGER,
            show: true,
            content: error?.message,
          });
        }
      }
    },
  },
};
</script>
