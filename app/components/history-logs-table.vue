<template>
  <div class="table-responsive table-responsive--radius">
    <b-skeleton-wrapper :loading="loading">
      <template #loading>
        <b-skeleton-table :rows="5" :columns="fields.length" />
      </template>

      <template v-if="items.length">
        <b-table-lite
          :fields="fields"
          :items="items"
          outlined
          striped
          bordered
          show-empty
          sticky-header
        >
          <template #cell(date)="data">
            <div v-html="$options.filters.columnValue(data.item.created)" />
          </template>

          <template #cell(user)="data">
            <div v-html="$options.filters.columnValue(data.item.username)" />
          </template>

          <template #cell(show_details)="row">
            <div class="text-center" v-if="row.item.log && row.item.log.length">
              <b-button
                class="btn--default p-0 bg-transparent border-0"
                style="color: #000"
                @click="row.toggleDetails"
              >
                <font-awesome-icon
                  style="color: #28a745"
                  :icon="row.detailsShowing ? 'minus' : 'plus'"
                />
              </b-button>
            </div>
          </template>

          <template #row-details="row">
            <b-table-simple fixed>
              <b-tbody>
                <b-tr v-for="(log, index) in row.item.log" :key="index">
                  <b-td class="align-middle">
                    <div class="text-break" style="line-height: 1">
                      {{ log.key }}
                    </div>
                  </b-td>
                  <b-td class="align-middle">
                    <div class="text-center">
                      {{ log.old }}
                    </div>
                  </b-td>
                  <b-td class="align-middle">
                    <div class="text-center">
                      <font-awesome-icon
                        icon="arrow-alt-circle-right"
                        size="lg"
                        style="color: #28a745"
                      />
                    </div>
                  </b-td>
                  <b-td class="align-middle">
                    <div class="text-center">
                      {{ log.new }}
                    </div>
                  </b-td>
                </b-tr>
              </b-tbody>
            </b-table-simple>
          </template>
        </b-table-lite>
      </template>

      <template v-else>
        <div class="text-center">There are no logs.</div>
      </template>
    </b-skeleton-wrapper>
  </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';

import {
  faPlus,
  faMinus,
  faArrowAltCircleRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faPlus, faMinus, faArrowAltCircleRight);

export default {
  name: 'HistoryLogsTable',

  components: { FontAwesomeIcon },

  filters: {
    columnValue(value) {
      return value ? value : '<span class="font-weight-bold">&#8212;</span>';
    },
  },

  props: {
    fields: {
      type: Array,
      required: true,
    },

    items: {
      type: Array,
      required: true,
    },

    loading: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
};
</script>
