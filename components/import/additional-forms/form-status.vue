<template>
  <b-card>
    <template #header>
      <h4 class="mb-0">Reasons form for <strong>Status</strong></h4>
    </template>

    <b-form id="form-status">
      <b-form-group class="default-form-group">
        <b-form-checkbox
          class="default-checkbox default-checkbox--order"
          plain
          :checked="forms.formStatus.checked ? true : false"
          @change="
            onUpdateHandler({
              key: 'isStatus',
              field: 'checked',
              value: $event,
            })
          "
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
          :value="forms.formStatus.reasonId"
          :class="{ 'multiselect--error': vv.$v.formStatus.reasonId.$error }"
          :options="statusReasonsOptions"
          :searchable="false"
          :show-labels="false"
          :allow-empty="false"
          :custom-label="customLabelMainReasons"
          placeholder="Выберите причину"
          @input="
            onUpdateHandler({
              key: 'isStatus',
              field: 'reasonId',
              value: +$event,
            })
          "
        />
      </b-form-group>

      <b-form-group
        v-if="forms.formStatus.reasonId === 0"
        class="default-form-group"
        label="Комментарий:"
        label-for="textarea-reason"
      >
        <b-form-textarea
          :value="forms.formStatus.comment"
          id="textarea-reason"
          :state="vv.$v.formStatus.comment.$error ? false : null"
          class="form-control-default"
          placeholder="Напишите причину отключение"
          @input="
            onUpdateHandler({
              key: 'isStatus',
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

import { DEFAULT_STATUS_FORM } from '@/status-management/constants/import-default-forms';

export default {
  name: 'FormStatus',

  props: {
    loading: {
      type: Boolean,
      required: true,
    },
  },

  inject: ['vv', 'forms', 'onResetValidation'],

  computed: {
    ...mapState('reasons', {
      statusReasons: (state) => state.statusReasons,
    }),

    statusReasonsOptions() {
      return this.statusReasons.map((item) => item.id);
    },
  },

  methods: {
    ...mapActions('import', [UPDATE_FORM, RESET_FORM]),

    onUpdateHandler(params) {
      this[UPDATE_FORM](params);

      this.onResetValidation();
    },

    customLabelMainReasons(id) {
      const option = this.statusReasons.find((item) => item.id === id);

      return option?.name || '';
    },
  },

  destroyed() {
    this[RESET_FORM]({ key: 'isStatus', value: DEFAULT_STATUS_FORM });
  },
};
</script>
