<template>
  <div class="import-confirm-settings" style="min-height: 20rem">
    <template v-if="vv.$v.$error">
      <b-alert show variant="danger">
        <strong class="d-block">{{ generalErrorMessage }}</strong>
      </b-alert>
      <b-alert :show="columnHandlersLenght" variant="danger">
        <strong class="d-block">{{ errorMessage }}</strong>
      </b-alert>
      <b-alert :show="!isProductID" variant="danger">
        <strong class="d-block">{{ productIDErrorMessage }}</strong>
      </b-alert>
    </template>

    <import-settings-card
      class="mb-5"
      :file-name="fileName"
      :headers-list="headersList"
      :parsing-methods="parsingMethods"
      :columns-handlers="columnsHandlers"
      :loading="loading"
    />

    <import-preview-card
      :headers-list="headersList"
      :rows="fileRowsData"
      :columns-handlers="columnsHandlers"
      :loading="loading"
    />
  </div>
</template>

<script>
import ImportSettingsCard from '@/status-management/components/import/import-settings-card.vue';
import ImportPreviewCard from '@/status-management/components/import/import-preview-card.vue';

export default {
  name: 'ImportConfirmSettings',

  components: { ImportSettingsCard, ImportPreviewCard },

  props: {
    loading: {
      type: Boolean,
      required: true,
    },

    columnsHandlers: {
      type: Array,
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    fileRowsData: {
      type: Array,
      required: true,
    },

    parsingMethods: {
      type: Array,
      required: true,
    },

    headersList: {
      type: Array,
      required: true,
    },
  },

  inject: ['vv'],

  data: () => ({
    generalErrorMessage: 'Please fill Spreadsheet columns with handlers.',
    errorMessage: 'More than one handler column must be selected.',
    productIDErrorMessage: 'Article No required field.',
  }),

  computed: {
    isProductID() {
      return Object.values(this.vv.$v.mappingColumnsHandlers.$model).includes(
        'articleNo'
      );
    },

    columnHandlersLenght() {
      return (
        Object.values(this.vv.$v.mappingColumnsHandlers.$model)?.length < 2
      );
    },
  },
};
</script>
