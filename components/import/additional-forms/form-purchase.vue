<template>
  <b-card>
    <template #header>
      <h4 class="mb-0">Reasons form for <strong>Purchase</strong></h4>
    </template>

    <b-form id="form-purchase">
      <b-form-group
        class="default-form-group"
        label="Основная причина:"
        label-for="main-reason"
      >
        <multiselect
          id="main-reason"
          :class="{
            'multiselect--error': vv.$v.formPurchase.mainReasonId.$error,
          }"
          :value="forms.formPurchase.mainReasonId"
          :options="mainReasonsOptions"
          :searchable="false"
          :show-labels="false"
          :allow-empty="false"
          :custom-label="customLabelMainReasons"
          placeholder="Выберите основную причину причину"
          @input="
            onUpdateHandler('main', {
              key: 'isPurchase',
              field: 'mainReasonId',
              value: $event,
            })
          "
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
          :value="forms.formPurchase.auxiliaryReasonId"
          :options="auxiliaryReasonsOptions"
          :searchable="false"
          :show-labels="false"
          :allow-empty="false"
          :custom-label="customLabelaAxiliaryReasons"
          placeholder="Выберите дополнительную причину"
          @input="
            onUpdateHandler('auxiliary', {
              key: 'isPurchase',
              field: 'auxiliaryReasonId',
              value: $event,
            })
          "
        />
      </b-form-group>

      <b-form-group
        class="default-form-group"
        label="Комментарий:"
        label-for="textarea-reason"
      >
        <b-form-textarea
          :value="forms.formPurchase.comment"
          :state="vv.$v.formPurchase.comment.$error ? false : null"
          id="textarea-reason"
          class="form-control-default"
          placeholder="Напишите причину отключение"
          @input="
            onUpdateHandler(null, {
              key: 'isPurchase',
              field: 'comment',
              value: $event,
            })
          "
        />
      </b-form-group>
    </b-form>
  </b-card>
</template>

<script>
import { mapState, mapActions } from '@modules/vuex';

import { UPDATE_FORM, RESET_FORM } from '@/status-management/constants/store/import/action-types';

import { DEFAULT_PURCHASE_FORM } from '@/status-management/constants/import-default-forms';

export default {
  name: 'FormPurchase',

  props: {
    loading: {
      type: Boolean,
      required: true,
    },
  },

  inject: ['vv', 'forms', 'onResetValidation'],

  computed: {
    ...mapState('reasons', {
      reasons: (state) => state.purchaseReasons,
    }),

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

      if (this.mainReasonId) {
        return reasons
          .map(([id, name]) => {
            const [parentId, auxiliaryId] = id.split(':');

            return {
              parentId: Number(parentId),
              id: Number(auxiliaryId),
              name,
            };
          })
          .filter((item) => item.parentId === this.mainReasonId);
      } else {
        return [];
      }
    },

    auxiliaryReasonsOptions() {
      return this.auxiliaryReasons.map((item) => item.id);
    },
  },

  methods: {
    ...mapActions('import', [UPDATE_FORM, RESET_FORM]),

    onUpdateHandler(type, params) {
      this.onResetValidation();

      if (type === 'main') {
        this[UPDATE_FORM]({
          ...params,
          value: this.mainReasons.find((item) => item.id === params.value)?.id,
        });

        this[UPDATE_FORM]({
          ...params,
          field: 'mainReason',
          value: this.mainReasons.find((item) => item.id === params.value)
            ?.name,
        });

        this.$nextTick(() => {
          this[UPDATE_FORM]({
            ...params,
            field: 'auxiliaryReasonId',
            value:
              this.auxiliaryReasons.find((item) => item.id === 1)?.id || null,
          });

          this[UPDATE_FORM]({
            ...params,
            field: 'auxiliaryReason',
            value:
              this.auxiliaryReasons.find((item) => item.id === 1)?.name || null,
          });
        });
      } else if (type === 'auxiliary') {
        this[UPDATE_FORM]({
          ...params,
          value: this.auxiliaryReasons.find((item) => item.id === params.value)
            ?.id,
        });

        this[UPDATE_FORM]({
          ...params,
          field: 'auxiliaryReason',
          value: this.auxiliaryReasons.find((item) => item.id === params.value)
            ?.name,
        });
      } else {
        this[UPDATE_FORM](params);
      }
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

  destroyed() {
    this[RESET_FORM]({ key: 'isPurchase', value: DEFAULT_PURCHASE_FORM });
  },
};
</script>
