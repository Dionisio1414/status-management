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

    <template #default>
      <b-overlay
        class="position-absolute"
        :class="{ 'b-overlay-wrap--loading': loading }"
        :show="loading"
      />
      <div v-html="customProps.description" />
    </template>

    <template #modal-footer="{ hide }">
      <div class="d-flex align-items-center justify-content-between w-100">
        <b-button
          class="btn--default"
          variant="primary"
          @click="applyHandler(hide)"
        >
          Apply
        </b-button>
        <b-button
          class="btn--default"
          variant="outline-secondary"
          @click="hide"
        >
          Close
        </b-button>
      </div>
    </template>
  </b-modal>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import { MODAL_CLOSE } from '@/constants/modals/modal-event-types';

import { UPDATE_PRODUCT } from '@/constants/store/product/action-types';

import { ALERT_EVENT_SHOW } from '@/constants/alert/alert-event-types';
import { SUCCESS, DANGER } from '@/constants/alert/alert-types';

import { UPDATE_TABLE } from '@/constants/store/product-list/action-types';

export default {
  name: 'ModalAction',

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

  computed: {
    ...mapState('productList', {
      selectedRows: (state) => state.table.selectedRows,
    }),

    ...mapState('product', {
      loading: (state) => state.loading,
    }),

    selectedRowsIds() {
      return (this.selectedRows || []).map((item) => item.id);
    },
  },

  methods: {
    ...mapActions('product', [UPDATE_PRODUCT]),
    ...mapActions('productList', [UPDATE_TABLE]),

    async applyHandler(hideCallback) {
      try {
        const formData = new FormData();

        formData.append('type', this.customProps.type);
        formData.append('enable', this.customProps.checked ? 1 : 0);

        this.selectedRowsIds.forEach((id) => {
          formData.append('id[]', id);
        });

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
    },

    closeHandler(callback) {
      const typeCallback = callback.vueTarget
        ? callback.vueTarget.hide
        : callback;

      this.$bus.$emit(MODAL_CLOSE, typeCallback);
    },
  },
};
</script>
