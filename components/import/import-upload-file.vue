<template>
  <div class="import-upload" style="min-height: 25rem">
    <b-alert show :variant="error ? 'danger' : 'info'">
      {{ error ? errorMessage : message }}
    </b-alert>

    <b-form-file
      class="custom-file-default"
      id="import-upload"
      size="lg"
      accept=".csv, .xls, .xlsx"
      :disabled="loading"
      @input="onLoadFile"
    >
      <template #placeholder>
        <div class="import-upload__placeholder text-center">
          <font-awesome-icon icon="cloud-download-alt" />
          <div class="text">
            Drag & Drop file here or click for select file.
          </div>
        </div>
      </template>
    </b-form-file>
  </div>
</template>

<script>
import { mapActions } from '@modules/vuex';

import { library } from '@modules/@fortawesome/fontawesome-svg-core';

import { faCloudDownloadAlt } from '@modules/@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@modules/@fortawesome/vue-fontawesome';

import { UPLOAD_FILE } from '@/status-management/constants/store/import/action-types';

import { ALERT_EVENT_SHOW } from '@/status-management/constants/alert/alert-event-types';
import { DANGER } from '@/status-management/constants/alert/alert-types';

library.add(faCloudDownloadAlt);

export default {
  name: 'ImportUploadFile',

  components: { FontAwesomeIcon },

  props: {
    step: {
      type: Number,
      required: true,
    },

    loading: {
      type: Boolean,
      required: true,
      default: false,
    },
  },

  data: () => ({
    error: false,
    errorMessage: null,
    message: 'Import settings will be available after uploading file.',
  }),

  methods: {
    ...mapActions('import', [UPLOAD_FILE]),

    async onLoadFile(file) {
      try {
        const formData = new FormData();

        formData.append('file', file);
        formData.append('filename', file.name);

        await this[UPLOAD_FILE](formData);

        this.error = false;
        this.errorMessage = null;

        this.$emit('next-step', this.step + 1);
      } catch (error) {
        this.error = true;
        this.errorMessage = error?.response?.data?.message;

        this.$bus.$emit(ALERT_EVENT_SHOW, {
          variant: DANGER,
          show: true,
          content: error?.response?.data?.message,
        });
      }
    },
  },
};
</script>
