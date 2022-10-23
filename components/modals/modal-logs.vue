<template>
  <b-modal
    :id="modalName"
    :visible="show"
    static
    scrollable
    hide-footer
    @hidden="closeHandler"
  >
    <template #modal-header="{ close }">
      <div class="d-flex align-items-center w-100">
        <h5 class="modal-title">Stark logs: {{ customProps.title }}</h5>
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

    <history-logs-table
      :loading="loading"
      :items="cloneItems"
      :fields="fields"
    />
  </b-modal>
</template>

<script>
import { mapActions, mapState } from '@modules/vuex';
import cloneDeep from '@modules/lodash.clonedeep';

import HistoryLogsTable from '@/status-management/components/history-logs-table.vue';

import { FIELDS_LOGS_TABLE } from '@/status-management/constants/fields-table';
import { MODAL_CLOSE } from '@/status-management/constants/modals/modal-event-types';

import { GET_PRODUCT_LOGS } from '@/status-management/constants/store/product/action-types';

import { ALERT_EVENT_SHOW } from '@/status-management/constants/alert/alert-event-types';
import { DANGER } from '@/status-management/constants/alert/alert-types';

export default {
  name: 'ModalLogs',

  components: { HistoryLogsTable },

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
    fields: FIELDS_LOGS_TABLE,
    cloneItems: [],
  }),

  computed: {
    ...mapState('product', {
      items: (state) => state.productLogs,
      loading: (state) => state.loading,
    }),
  },

  methods: {
    ...mapActions('product', [GET_PRODUCT_LOGS]),

    closeHandler(callback) {
      const typeCallback = callback.vueTarget
        ? callback.vueTarget.hide
        : callback;

      this.$bus.$emit(MODAL_CLOSE, typeCallback);
    },
  },

  async created() {
    try {
      await this[GET_PRODUCT_LOGS](this.customProps.id);

      this.cloneItems = cloneDeep(this.items);
    } catch (error) {
      this.$bus.$emit(ALERT_EVENT_SHOW, {
        variant: DANGER,
        show: true,
        content: error?.message,
      });
    }
  },
};
</script>
