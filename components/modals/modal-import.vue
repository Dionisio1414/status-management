<template>
  <b-modal
    :id="modalName"
    :visible="show"
    static
    scrollable
    size="lg"
    :ref="modalName"
    :hide-footer="hideFooter"
    @hidden="closeHandler"
  >
    <template #modal-header="{ close }">
      <div class="d-flex align-items-center w-100">
        <h5 class="modal-title">Import</h5>
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

      <div class="import">
        <import-steps-header :step="step" />

        <transition name="fade" mode="out-in">
          <component
            :is="currentComponent"
            :step="step"
            :columns-handlers="columnsHandlers"
            :file-name="fileName"
            :file-rows-data="fileRowsData"
            :headers-list="headersList"
            :parsing-methods="parsingMethods"
            :loading="loading"
            @next-step="onNextStepHandler"
          />
        </transition>
      </div>
    </template>

    <template #modal-footer="{ hide }">
      <div class="d-flex align-items-center justify-content-between w-100">
        <b-button
          class="btn--default"
          variant="primary"
          :disabled="loading"
          @click="onValidationHandler(hide)"
        >
          Import CSV
        </b-button>

        <b-button
          class="btn--default"
          variant="danger"
          @click="onResetStep"
          :disabled="loading"
        >
          Reset
        </b-button>
      </div>
    </template>
  </b-modal>
</template>

<script>
import { mapState, mapActions, mapGetters } from '@modules/vuex';

import { validationMixin } from '@modules/vuelidate';

import { requiredIf, required } from '@modules/vuelidate/lib/validators';

import ImportStepsHeader from '@/status-management/components/import/import-steps-header.vue';
import ImportUploadFile from '@/status-management/components/import/import-upload-file.vue';
import ImportConfirmSettings from '@/status-management/components/import/import-confirm-settings.vue';

import { MODAL_CLOSE } from '@/status-management/constants/modals/modal-event-types';
import {
  UPDATE_BY_FILE,
  RESET_COLUMN_HANDLERS,
} from '@/status-management/constants/store/import/action-types';
import { ALERT_EVENT_SHOW } from '@/status-management/constants/alert/alert-event-types';
import {
  SUCCESS,
  DANGER,
} from '@/status-management/constants/alert/alert-types';

export default {
  name: 'ModalImport',

  mixins: [validationMixin],

  components: {
    'import-upload-file': ImportUploadFile,
    'import-steps-header': ImportStepsHeader,
    'import-confirm-settings': ImportConfirmSettings,
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
    step: 1,
  }),

  validations() {
    let validationScheme = {};

    let mappingColumnsHandlers = {
      mappingColumnsHandlers: {
        mappingColumns: (value) => {
          const values = Object.values(value);

          return values.length >= 2 && values.includes('articleNo');
        },
      },
    };

    let formPurchaseValidation = {
      formPurchase: {
        mainReasonId: { required },
        mainReason: { required },
        comment: {
          required: requiredIf(function () {
            return (
              this.formPurchase.mainReasonId &&
              this.formPurchase.auxiliaryReasonId === null
            );
          }),
        },
      },
    };

    let formStatusValidation = {
      formStatus: {
        reasonId: { required },
        comment: {
          required: requiredIf(function () {
            return this.formStatus.reasonId === 0;
          }),
        },
      },
    };

    let formRockValidation = {
      formRock: {
        rock: { required },
        level: { required },
      },
    };

    if (
      Object.prototype.hasOwnProperty.call(this.mappingExtraFields, 'isStatus')
    ) {
      validationScheme = { ...validationScheme, ...formStatusValidation };
    }

    if (
      Object.prototype.hasOwnProperty.call(this.mappingExtraFields, 'isRock')
    ) {
      validationScheme = { ...validationScheme, ...formRockValidation };
    }

    if (
      Object.prototype.hasOwnProperty.call(
        this.mappingExtraFields,
        'isPurchase'
      )
    ) {
      validationScheme = { ...validationScheme, ...formPurchaseValidation };
    }

    return { ...validationScheme, ...mappingColumnsHandlers };
  },

  provide() {
    const vv = {};
    const forms = {};

    Object.defineProperty(vv, '$v', {
      enumerable: true,
      get: () => this.$v,
    });

    Object.defineProperties(forms, {
      formRock: {
        enumerable: true,
        get: () => this.formRock,
      },

      formStatus: {
        enumerable: true,
        get: () => this.formStatus,
      },

      formPurchase: {
        enumerable: true,
        get: () => this.formPurchase,
      },
    });

    return {
      vv,
      forms,
      onResetValidation: this.onResetValidation,
    };
  },

  computed: {
    ...mapState('import', {
      loading: (state) => state.loading,
      columnsHandlers: (state) => state.columnsHandlers,
      fileData: (state) => state.file?.file,
      form: (state) => state.form,
    }),

    ...mapGetters('import', ['headersList', 'parsingMethods']),

    formRock() {
      return {
        rock: this.form?.isRock?.rock,
        level: this.form?.isRock?.level,
      };
    },

    formStatus() {
      return {
        checked: this.form?.isStatus?.checked,
        reasonId: this.form?.isStatus?.reasonId,
        comment: this.form?.isStatus?.comment,
      };
    },

    formPurchase() {
      return {
        comment: this.form?.isPurchase?.comment,
        mainReasonId: this.form?.isPurchase?.mainReasonId,
        auxiliaryReasonId: this.form?.isPurchase?.auxiliaryReasonId,
        mainReason: this.form?.isPurchase?.mainReason,
        auxiliaryReason: this.form?.isPurchase?.auxiliaryReason,
      };
    },

    fileName() {
      return this.fileData?.fileName ?? '-';
    },

    fileRowsData() {
      return this.fileData?.rowsData ?? [];
    },

    fileHash() {
      return this.fileData?.fileHash;
    },

    currentComponent() {
      switch (this.step) {
        case 1:
          return 'import-upload-file';
        case 2:
          return 'import-confirm-settings';
        default:
          return 'import-upload-file';
      }
    },

    hideFooter() {
      return this.step === 1;
    },

    mappingColumnsHandlers() {
      const selectedColumns = this.columnsHandlers.filter((column) => column);

      if (selectedColumns.length) {
        return selectedColumns.reduce(
          (obj, column) => ({ ...obj, [column?.cellkey]: column?.key }),
          {}
        );
      } else {
        return {};
      }
    },

    mappingParsingMethods() {
      return Object.values(this.mappingColumnsHandlers || []);
    },

    mappingExtraFields() {
      const extraObject = {};
      const extraParsingMethods = Object.values(
        this.mappingColumnsHandlers || []
      ).filter((column) => column);

      extraParsingMethods.forEach((type) => {
        if (type === 'isRock' || type === 'isStatus' || type === 'isPurchase') {
          extraObject[type] = this.form[type];
        }
      });

      return extraObject;
    },
  },

  methods: {
    ...mapActions('import', [UPDATE_BY_FILE, RESET_COLUMN_HANDLERS]),

    async onImportHandler(hideCallback) {
      try {
        await this[UPDATE_BY_FILE]({
          mapping: this.mappingColumnsHandlers,
          fileHash: this.fileHash,
          ...this.mappingExtraFields,
        });

        this.$bus.$emit(ALERT_EVENT_SHOW, {
          variant: SUCCESS,
          show: true,
          content: 'Successfully import',
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

    onNextStepHandler(step) {
      this.step = step;
    },

    onResetValidation() {
      this.$v.$reset();
    },

    onResetStep() {
      this.step = 1;
      this[RESET_COLUMN_HANDLERS]();
      this.onResetValidation();
    },

    onValidationHandler(hideCallback) {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.onImportHandler(hideCallback);
      } else {
        this.onScrollToTop();
      }
    },

    onScrollToTop() {
      const modalContent = this.$el.querySelector(
        `#${this.modalName}___BV_modal_body_`
      );
      const isScroll = modalContent.scrollHeight > modalContent.clientHeight;
      const el = this.$el.querySelector('.breadcrumb');

      if (el && isScroll) {
        el.scrollIntoView({ block: 'end', behavior: 'smooth' });
      }
    },

    closeHandler(callback) {
      const typeCallback = callback.vueTarget
        ? callback.vueTarget.hide
        : callback;

      this.$bus.$emit(MODAL_CLOSE, typeCallback);
    },
  },

  destroyed() {
    this[RESET_COLUMN_HANDLERS]();
  },
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s ease-in-out;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
