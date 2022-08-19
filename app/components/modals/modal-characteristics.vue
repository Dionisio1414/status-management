<template>
  <b-modal
    :id="modalName"
    :visible="show"
    static
    scrollable
    hide-footer
    size="lg"
    @hidden="closeHandler"
  >
    <template #modal-header="{ close }">
      <div class="d-flex align-items-center w-100">
        <h5 class="modal-title">Характеристики {{ customProps.title }}</h5>
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

    <characteristics-table :loading="loading" :fields="fields" :items="items" />

    <template #modal-footer="{ hide }">
      <b-button class="btn--default" variant="outline-secondary" @click="hide">
        Close
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import CharacteristicsTable from '@/components/characteristics-table.vue';

import { FIELDS_CHARACTERISTICS_TABLE } from '@/constants/fields-table';
import { MODAL_CLOSE } from '@/constants/modals/modal-event-types';

import { GET_PRODUCT_CHARACTERISTICS } from '@/constants/store/product/action-types';

import { ALERT_EVENT_SHOW } from '@/constants/alert/alert-event-types';
import { DANGER } from '@/constants/alert/alert-types';

export default {
  name: 'ModalCharacteristics',

  components: { CharacteristicsTable },

  filters: {
    valueByType(value, type) {
      return type !== 'dynamic'
        ? value
        : '<span class="font-weight-bold">&#8212;</span>';
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
    fields: FIELDS_CHARACTERISTICS_TABLE,
  }),

  computed: {
    ...mapState('product', {
      items: (state) => state.productCharacteristics,
      loading: (state) => state.loading,
    }),
  },

  methods: {
    ...mapActions('product', [GET_PRODUCT_CHARACTERISTICS]),

    closeHandler(callback) {
      const typeCallback = callback.vueTarget
        ? callback.vueTarget.hide
        : callback;

      this.$bus.$emit(MODAL_CLOSE, typeCallback);
    },
  },

  created() {
    try {
      this[GET_PRODUCT_CHARACTERISTICS](this.customProps.id);
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
