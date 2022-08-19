<template>
  <b-modal :id="modalName" :visible="show" static @hidden="closeHandler">
    <template #modal-header="{ close }">
      <div class="d-flex align-items-center w-100">
        <h3 class="modal-title">
          Отключение на сайте: {{ customProps.title }}
        </h3>
        <button
          type="button"
          style="font-size: 2rem"
          class="close"
          :disabled="loading"
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

      <b-form id="form-reasons" @submit.prevent="applyFormHandler(hide)">
        <b-form-group class="default-form-group">
          <b-form-checkbox
            v-model="form.checked"
            class="default-checkbox default-checkbox--order"
            plain
          >
            Отключение навсегда:
          </b-form-checkbox>
        </b-form-group>

        <b-form-group
          class="default-form-group"
          label="Причина отключения:"
          label-for="reasons-list"
        >
          <multiselect
            id="reasons-list"
            v-model="form.reasonId"
            :class="{ 'multiselect--error': $v.form.reasonId.$error }"
            :options="statusReasonsOptions"
            :searchable="false"
            :show-labels="false"
            :allow-empty="false"
            :custom-label="customLabelMainReasons"
            placeholder="Выберите причину"
            @select="$v.$reset()"
          />
        </b-form-group>

        <b-form-group
          v-if="form.reasonId === 0"
          class="default-form-group"
          label="Комментарий:"
          label-for="textarea-reason"
        >
          <b-form-textarea
            v-model="form.comment"
            id="textarea-reason"
            :state="$v.form.comment.$error ? false : null"
            class="form-control-default"
            placeholder="Напишите причину отключение"
          />
        </b-form-group>
      </b-form>
    </template>

    <template #modal-footer="{ hide }">
      <div class="d-flex align-items-center justify-content-between w-100">
        <b-button
          type="submit"
          form="form-reasons"
          class="btn--default"
          variant="primary"
          :disabled="loading"
        >
          Save
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
import { mapState, mapActions } from 'vuex';
import { validationMixin } from 'vuelidate';

import { required, requiredIf } from 'vuelidate/lib/validators';

import { MODAL_CLOSE } from '@/constants/modals/modal-event-types';

import { UPDATE_PRODUCT } from '@/constants/store/product/action-types';

import { ALERT_EVENT_SHOW } from '@/constants/alert/alert-event-types';
import { SUCCESS, DANGER } from '@/constants/alert/alert-types';

import { UPDATE_TABLE } from '@/constants/store/product-list/action-types';

export default {
  name: 'ModalStatusReasons',

  mixins: [validationMixin],

  validations: {
    form: {
      reasonId: { required },
      comment: {
        required: requiredIf(function () {
          return this.form.reasonId === 0;
        }),
      },
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
      checked: false,
      reasonId: null,
      comment: null,
    },
  }),

  computed: {
    ...mapState('reasons', {
      statusReasons: (state) => state.statusReasons,
    }),

    ...mapState('productList', {
      selectedRows: (state) => state.table.selectedRows,
    }),

    ...mapState('product', {
      loading: (state) => state.loading,
    }),

    statusReasonsOptions() {
      return this.statusReasons.map((item) => item.id);
    },

    selectedRowsIds() {
      return (this.selectedRows || []).map((item) => item.id);
    },
  },

  methods: {
    ...mapActions('product', [UPDATE_PRODUCT]),
    ...mapActions('productList', [UPDATE_TABLE]),

    async applyFormHandler(hideCallback) {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        try {
          const formData = new FormData();

          formData.append('reasonId', this.form.reasonId);
          this.form.comment && formData.append('comment', this.form.comment);
          this.form.checked && formData.append('checked', 1);
          formData.append('type', this.customProps.type);
          formData.append('isDisabled', 'no');

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

    closeHandler(callback) {
      const typeCallback = callback.vueTarget
        ? callback.vueTarget.hide
        : callback;

      this.$bus.$emit(MODAL_CLOSE, typeCallback);
    },

    customLabelMainReasons(id) {
      const option = this.statusReasons.find((item) => item.id === id);

      return option?.name || '';
    },
  },

  created() {
    this.form.reasonId = 0;
  },
};
</script>
