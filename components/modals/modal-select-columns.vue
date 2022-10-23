<template>
  <b-modal :id="modalName" :visible="show" static @hidden="closeHandler">
    <template #modal-header="{ close }">
      <div class="d-flex align-items-center w-100">
        <b-form-checkbox
          class="default-checkbox mr-3"
          v-model="isAllSelected"
          plain
          @change="onAllCheckedHandler"
        />
        <h5 class="modal-title">Selected columns</h5>
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

    <template #default="{ hide }">
      <b-form
        id="form-select-columns"
        style="column-count: 3"
        @submit.prevent="applyFormHandler(hide)"
      >
        <b-form-checkbox
          class="default-checkbox default-checkbox--inline me-3"
          v-for="field in isEditableFieldsHandler(fieldsList)"
          :key="field.key"
          :checked="field.visible ? true : false"
          plain
          @change="onSelectHandler(field.key, field.visible)"
        >
          {{ field.label }}
        </b-form-checkbox>
      </b-form>
    </template>

    <template #modal-footer>
      <div class="d-flex align-items-center w-100">
        <div
          v-b-tooltip.hover
          title="There were no changes"
          :disabled="isChanged"
        >
          <b-button
            class="btn--default"
            type="submit"
            form="form-select-columns"
            variant="primary"
            :disabled="!isChanged || !visibleFields.length"
          >
            Apply
          </b-button>
        </div>

        <div
          class="ml-auto mr-3"
          v-b-tooltip.hover
          title="All fields already selected"
          :disabled="!isAllCheckedFields"
        >
          <b-button
            class="btn--default"
            variant="info"
            :disabled="isAllCheckedFields"
            @click="onSelectAllHandler"
          >
            Select All
          </b-button>
        </div>

        <div
          v-b-tooltip.hover
          title="There were no changes"
          :disabled="isChanged"
        >
          <b-button
            class="btn--default"
            :disabled="!isChanged"
            @click="onResetHandler"
          >
            Reset
          </b-button>
        </div>
      </div>
    </template>
  </b-modal>
</template>

<script>
import { mapState, mapActions } from '@modules/vuex';
import cloneDeep from '@modules/lodash.clonedeep';

import { FIELDS_TABLE } from '@/status-management/constants/fields-table.js';
import { UPDATE_TABLE } from '@/status-management/constants/store/product-list/action-types';

import { ALERT_EVENT_SHOW } from '@/status-management/constants/alert/alert-event-types';
import { SUCCESS } from '@/status-management/constants/alert/alert-types';
import { MODAL_CLOSE } from '@/status-management/constants/modals/modal-event-types';

const resetFields = cloneDeep(FIELDS_TABLE);

export default {
  props: {
    modalName: {
      type: String,
      required: true,
    },

    show: {
      type: Boolean,
      required: true,
    },
  },

  data: () => ({
    isAllSelected: false,
    isChanged: false,
    copyFields: null,
  }),

  computed: {
    ...mapState('productList', {
      fields: (state) => state.table.fields,
    }),

    fieldsList: {
      get() {
        return this.copyFields?.filter((item) => item.key !== 'selected');
      },

      set(value) {
        this.copyFields = value;
      },
    },

    visibleFields() {
      return this.fieldsList?.filter((field) => field.visible);
    },

    isAllCheckedFields() {
      return this.visibleFields?.length === this.fieldsList?.length;
    },
  },

  methods: {
    ...mapActions('productList', [UPDATE_TABLE]),

    isEditableFieldsHandler(fields) {
      return fields.filter((field) => field.isEditable);
    },

    toggleVisibleFields(fields, visible) {
      return fields.map((item) => ({ ...item, visible }));
    },

    onAllCheckedHandler() {
      this.isChanged = true;
      this.isAllSelected
        ? (this.fieldsList = this.toggleVisibleFields(this.fieldsList, true))
        : (this.fieldsList = this.toggleVisibleFields(this.fieldsList, false));
    },

    checkSelectedHandler(visibleFields) {
      visibleFields.length === this.fieldsList.length
        ? (this.isAllSelected = true)
        : (this.isAllSelected = false);
    },

    onSelectAllHandler() {
      this.isChanged = true;
      this.isAllSelected
        ? (this.fieldsList = this.toggleVisibleFields(this.fieldsList, false))
        : (this.fieldsList = this.toggleVisibleFields(this.fieldsList, true));
    },

    onResetHandler() {
      this.fieldsList = resetFields.map((item) => ({ ...item }));
    },

    onSelectHandler(key, visible) {
      this.isChanged = true;
      this.fieldsList = this.fieldsList.reduce((acc, field) => {
        if (field.key === key) {
          return [...acc, { ...field, visible: !visible }];
        }

        return [...acc, field];
      }, []);
    },

    applyFormHandler(hideCallback) {
      const value = [
        { key: 'selected', label: '', visible: true, isEditable: false },
        ...this.fieldsList,
      ];

      this[UPDATE_TABLE]({ key: 'fields', value, isParams: false });

      this.closeHandler(hideCallback);
    },

    closeHandler(callback) {
      if (callback.vueTarget) {
        this.$bus.$emit(MODAL_CLOSE, callback.vueTarget.hide);
      } else {
        this.$bus.$emit(MODAL_CLOSE, callback);
        this.$bus.$emit(ALERT_EVENT_SHOW, {
          variant: SUCCESS,
          show: true,
          content: 'Columns changed',
        });
      }
    },
  },

  created() {
    this.copyFields = this.fields;
  },

  mounted() {
    this.checkSelectedHandler(this.visibleFields, this.fieldsList);
  },

  watch: {
    visibleFields(value) {
      this.checkSelectedHandler(value, this.fieldsList);
    },
  },
};
</script>
