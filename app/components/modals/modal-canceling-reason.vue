<template>
  <b-modal :id="modalName" :visible="show" static @hidden="closeHandler">
    <template #modal-header="{ close }">
      <div class="d-flex align-items-center w-100">
        <h3 class="modal-title">Причина отключения</h3>
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

      <b-form id="cancelling-reasons" @submit.prevent="applyFormHandler(hide)">
        <b-form-group
          class="default-form-group"
          label="Основная причина:"
          label-for="main-reason"
        >
          <multiselect
            id="main-reason"
            :class="{ 'multiselect--error': $v.form.mainReasonId.$error }"
            :value="form.mainReasonId"
            :options="mainReasonsOptions"
            :searchable="false"
            :show-labels="false"
            :allow-empty="false"
            :custom-label="customLabelMainReasons"
            placeholder="Выберите основную причину причину"
            @select="onChangeReason({ type: 'main', id: $event })"
          />
        </b-form-group>

        <b-form-group
          v-if="auxiliaryReasonsOptions.length"
          class="default-form-group"
          label="Дополнительная причина:"
          label-for="auxiliary-reason"
        >
          <multiselect
            id="auxiliary-reason"
            :value="form.auxiliaryReasonId"
            :options="auxiliaryReasonsOptions"
            :searchable="false"
            :show-labels="false"
            :allow-empty="false"
            :custom-label="customLabelaAxiliaryReasons"
            placeholder="Выберите дополнительную причину"
            @select="onChangeReason({ type: 'auxiliary', id: $event })"
          />
        </b-form-group>

        <b-form-group
          class="default-form-group"
          label="Комментарий:"
          label-for="textarea-reason"
        >
          <b-form-textarea
            v-model.trim="form.comment"
            :state="$v.form.comment.$error ? false : null"
            id="textarea-reason"
            class="form-control-default"
            placeholder="Напишите причину отключение"
          />
        </b-form-group>
      </b-form>
    </template>

    <template #modal-footer="{ hide }">
      <div class="d-flex justify-content-between w-100">
        <b-button
          class="btn--default"
          type="submit"
          form="cancelling-reasons"
          :disabled="loading"
          variant="primary"
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

import { ALERT_EVENT_SHOW } from '@/constants/alert/alert-event-types';
import { SUCCESS, DANGER } from '@/constants/alert/alert-types';

import { UPDATE_PRODUCT } from '@/constants/store/product/action-types';
import { UPDATE_TABLE } from '@/constants/store/product-list/action-types';

export default {
  name: 'ModalCancelingReason',

  mixins: [validationMixin],

  validations: {
    form: {
      mainReasonId: { required },
      mainReason: { required },
      comment: {
        required: requiredIf(function () {
          return this.form.mainReasonId && this.form.auxiliaryReasonId === null;
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
      comment: null,
      mainReasonId: null,
      auxiliaryReasonId: null,
      mainReason: null,
      auxiliaryReason: null,
    },
  }),

  computed: {
    ...mapState('reasons', {
      reasons: (state) => state.purchaseReasons,
    }),

    ...mapState('productList', {
      selectedRows: (state) => state.table.selectedRows,
    }),

    ...mapState('product', {
      loading: (state) => state.loading,
    }),

    selectedRowsIds() {
      return (this.selectedRows || []).map((item) => item.id);
    },

    mainReasons() {
      return Object.entries(this.reasons.mainReason || []).map(([id, name]) => {
        return { id: Number(id), name };
      });
    },

    mainReasonsOptions() {
      return this.mainReasons.map((item) => item.id);
    },

    auxiliaryReasons() {
      const reasons = Object.entries(this.reasons.auxiliaryReason);

      if (this.form.mainReasonId) {
        return reasons
          .map(([id, name]) => {
            const [parentId, auxiliaryId] = id.split(':');

            return {
              parentId: Number(parentId),
              id: Number(auxiliaryId),
              name,
            };
          })
          .filter((item) => item.parentId === this.form.mainReasonId);
      } else {
        return [];
      }
    },

    auxiliaryReasonsOptions() {
      return this.auxiliaryReasons.map((item) => item.id);
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

          formData.append('mainReasonId', this.form.mainReasonId);
          this.form.auxiliaryReasonId &&
            formData.append('auxiliaryReasonId', this.form.auxiliaryReasonId);
          formData.append('mainReason', this.form.mainReason);
          this.form.auxiliaryReason &&
            formData.append('auxiliaryReason', this.form.auxiliaryReason);
          formData.append('enable', this.customProps.checked ? 1 : 0);
          this.form.comment && formData.append('comment', this.form.comment);
          formData.append('type', this.customProps.type);

          if (this.customProps.isMassUpdate) {
            this.selectedRowsIds.forEach((id) => {
              formData.append('id[]', id);
            });
          } else {
            formData.append('id', this.customProps.starkId);
          }

          await this[UPDATE_PRODUCT](formData);
          await this[UPDATE_TABLE]({
            key: 'selectedRows',
            value: [],
            isParams: false,
          });

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

    onChangeReason({ type, id }) {
      this.$v.$reset();

      if (type === 'main') {
        this.form.mainReason = this.mainReasons.find(
          (item) => item.id === id
        )?.name;
        this.form.mainReasonId = this.mainReasons.find(
          (item) => item.id === id
        )?.id;

        this.$nextTick(() => {
          this.form.auxiliaryReasonId =
            this.auxiliaryReasons.find((item) => item.id === 1)?.id || null;
          this.form.auxiliaryReason =
            this.auxiliaryReasons.find((item) => item.id === 1)?.name || null;
        });
      } else {
        this.form.auxiliaryReason = this.auxiliaryReasons.find(
          (item) => item.id === id
        )?.name;
        this.form.auxiliaryReasonId = this.auxiliaryReasons.find(
          (item) => item.id === id
        )?.id;
      }
    },

    closeHandler(callback) {
      const typeCallback = callback.vueTarget
        ? callback.vueTarget.hide
        : callback;

      this.$bus.$emit(MODAL_CLOSE, typeCallback);
    },

    customLabelMainReasons(id) {
      const option = this.mainReasons.find((item) => item.id === id);

      return option?.name || '';
    },

    customLabelaAxiliaryReasons(id) {
      const option = this.auxiliaryReasons.find((item) => item.id === id);

      return option?.name || '';
    },
  },
};
</script>
