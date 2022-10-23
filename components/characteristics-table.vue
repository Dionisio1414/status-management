<template>
  <div class="table-responsive table-responsive--radius">
    <b-skeleton-wrapper :loading="loading">
      <template #loading>
        <b-skeleton-table :rows="5" :columns="fields.length" />
      </template>

      <b-table-lite
        :fields="fields"
        :items="items"
        outlined
        hover
        striped
        bordered
        show-empty
        fixed
        sticky-header
      >
        <template #cell(id)="data">
          <div v-html="$options.filters.columnValue(data.item.param_id)" />
        </template>

        <template #cell(name)="data">
          <div v-html="$options.filters.columnValue(data.item.param)" />
        </template>

        <template #cell(value)="data">
          <div
            v-html="
              $options.filters.valueByType(data.item.value, data.item.type)
            "
          />
        </template>

        <template #cell(type)="data">
          <div v-html="$options.filters.columnValue(data.item.type)" />
        </template>
      </b-table-lite>
    </b-skeleton-wrapper>
  </div>
</template>

<script>
export default {
  name: 'CharacteristicsTable',

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

  filters: {
    valueByType(value, type) {
      return type !== 'dynamic'
        ? value
        : '<span class="font-weight-bold">&#8212;</span>';
    },

    columnValue(value) {
      return value ? value : '<span class="font-weight-bold">&#8212;</span>';
    },
  },
};
</script>
