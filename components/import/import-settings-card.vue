<template>
  <b-card header-class="d-flex align-items-center">
    <template #header>
      <h4 class="mr-2 mb-0">Confirm settings:</h4>
      <font-awesome-icon icon="file" class="mr-2" style="color: #999" />
      <span style="color: #999" v-html="fileName" />
    </template>

    <b-table-simple small bordered outlined>
      <b-thead>
        <b-tr>
          <b-th v-for="(cell, index) in confirmSettingsFields" :key="index">
            {{ cell.label }}
          </b-th>
        </b-tr>
      </b-thead>

      <b-tbody>
        <b-tr v-for="(cell, index) in headersList" :key="index">
          <b-td>{{ cell.label }}</b-td>
          <b-td>
            <div
              class="multiselect-wrapper m-1"
              :class="{ 'mb-3': checkFormByKey(columnsHandlers[index]) }"
            >
              <multiselect
                :class="{ 'multiselect--error': vv.$v.$error }"
                :value="columnsHandlers[index]"
                :id="`parsing-methods-${index}`"
                label="label"
                track-by="key"
                class="multiselect--import"
                :options="parsingMethodsList"
                :searchable="false"
                :show-labels="false"
                :allow-empty="false"
                :disabled="loading"
                placeholder="Choose column handler"
                @select="onSetColumnHandler($event, index, cell.key)"
              />

              <button
                v-show="columnsHandlers[index]"
                class="multiselect--clear"
                type="button"
                @click="onRemoveColumnHandler(index)"
              >
                <font-awesome-icon icon="times" />
              </button>
            </div>

            <form-wrapper
              v-if="checkFormByKey(columnsHandlers[index])"
              :column-handler="columnsHandlers[index]"
              :loading="loading"
            />
          </b-td>
        </b-tr>
      </b-tbody>
    </b-table-simple>
  </b-card>
</template>

<script>
import { mapActions } from '@modules/vuex';

import { library } from '@modules/@fortawesome/fontawesome-svg-core';

import { FontAwesomeIcon } from '@modules/@fortawesome/vue-fontawesome';
import FormWrapper from '@/status-management/components/import/additional-forms/form-wrapper.vue';

import { faFile, faTimes } from '@modules/@fortawesome/free-solid-svg-icons';

import { FIELDS_CONFIRM_SETTINGS } from '@/status-management/constants/fields-table';
import {
  SET_COLUMN_HANDLER,
  REMOVE_COLUMN_HANDLER,
} from '@/status-management/constants/store/import/action-types';

library.add(faFile, faTimes);

export default {
  name: 'ImportSettingsCard',

  components: { FontAwesomeIcon, FormWrapper },

  props: {
    fileName: {
      type: String,
      required: true,
    },

    headersList: {
      type: Array,
      required: true,
    },

    parsingMethods: {
      type: Array,
      required: true,
    },

    columnsHandlers: {
      type: Array,
      required: true,
    },

    loading: {
      type: Boolean,
      required: true,
    },
  },

  inject: ['vv', 'onResetValidation'],

  data: () => ({
    confirmSettingsFields: FIELDS_CONFIRM_SETTINGS,
    parsingMethodsList: [],
    isChange: false,
  }),

  methods: {
    ...mapActions('import', [SET_COLUMN_HANDLER, REMOVE_COLUMN_HANDLER]),

    checkFormByKey(column) {
      if (
        column &&
        (column?.key === 'isRock' ||
          column?.key === 'isStatus' ||
          column?.key === 'isPurchase')
      ) {
        return true;
      } else {
        return false;
      }
    },

    onSetColumnHandler(data, index, cellkey) {
      this[SET_COLUMN_HANDLER]({
        index,
        action: 'set',
        data: { ...data, cellkey },
      });

      if (!this.isChange) this.isChange = true;

      this.onResetValidation();
    },

    onRemoveColumnHandler(index) {
      this[REMOVE_COLUMN_HANDLER]({ index, action: 'remove' });

      this.onResetValidation();
    },

    onCheckColumn(key) {
      return this.columnsHandlers?.some((item) => item?.key === key);
    },

    onGenerateParsingMethods() {
      this.parsingMethodsList = this.parsingMethods.map((item) => ({
        ...item,
        $isDisabled: this.onCheckColumn(item?.key),
      }));
    },
  },

  created() {
    this.onGenerateParsingMethods();
  },

  watch: {
    columnsHandlers() {
      if (this.isChange) {
        this.onGenerateParsingMethods();
      }
    },
  },
};
</script>
