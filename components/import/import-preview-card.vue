<template>
  <b-card>
    <template #header>
      <h4 class="card-header-title">Preview imported spreadsheet file</h4>
    </template>

    <div class="table-responsive table-responsive--radius">
      <b-table-simple small bordered outlined>
        <b-thead>
          <b-tr>
            <b-th v-for="(cell, index) in headersList" :key="index">
              {{ cell.label }}
            </b-th>
          </b-tr>
        </b-thead>

        <b-tbody>
          <b-tr v-for="(row, index) in rows" :key="index">
            <b-td
              v-for="(value, key, cellindex) in row"
              :key="cellkey + cellindex"
              :variant="setColumnVariant(key, cellindex)"
            >
              <div v-html="$options.filters.cellValue(value)" />
            </b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
    </div>
  </b-card>
</template>

<script>
export default {
  name: 'ImportPreviewCard',

  props: {
    headersList: {
      type: Array,
      required: true,
    },

    rows: {
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

  filters: {
    cellValue(value) {
      return value
        ? value
        : '<div class="font-weight-bold text-center">&#8212;</div>';
    },
  },

  data: () => ({
    cellkey: 0,
  }),

  methods: {
    setColumnVariant(key, cellindex) {
      if (
        this.columnsHandlers.some(
          (column, index) => column?.cellkey === key && index === cellindex
        )
      ) {
        return 'primary';
      } else {
        return null;
      }
    },
  },

  watch: {
    columnsHandlers() {
      this.cellkey++;
    },
  },
};
</script>
