<template>
  <default-layout>
    <template #filters>
      <status-management-filters :loading="loading" />
    </template>
    <template #actions>
      <status-management-actions :loading="loading" />
    </template>

    <status-management-table :loading="loading" @update-data="updateData" />
  </default-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import DefaultLayout from '@/layouts/default-layout.vue';
import StatusManagementFilters from '@/components/status-management-filters.vue';
import StatusManagementActions from '@/components/status-management-actions.vue';
import StatusManagementTable from '@/components/status-management-table.vue';

import { GET_PRODUCTS } from '@/constants/store/product-list/action-types';
import { GET_CATEGORIES } from '@/constants/store/main-filters/action-types';
import { GET_PURSCHASE_REASONS } from '@/constants/store/reasons/action-types';
import { GET_COMMENTS_GROUPS } from '@/constants/store/product/action-types';

import { ALERT_EVENT_SHOW } from '@/constants/alert/alert-event-types';
import { DANGER } from '@/constants/alert/alert-types';

export default {
  name: 'StatusManagement',

  components: {
    DefaultLayout,
    StatusManagementFilters,
    StatusManagementActions,
    StatusManagementTable,
  },

  computed: {
    ...mapState(['loading']),
  },

  methods: {
    ...mapActions('productList', [GET_PRODUCTS]),
    ...mapActions('mainFilters', [GET_CATEGORIES]),
    ...mapActions('reasons', [GET_PURSCHASE_REASONS]),
    ...mapActions('product', [GET_COMMENTS_GROUPS]),

    updateData() {
      this[GET_PRODUCTS]();
    },
  },

  mounted() {
    Promise.all([
      this[GET_CATEGORIES](),
      this[GET_PRODUCTS](),
      this[GET_PURSCHASE_REASONS](),
      this[GET_COMMENTS_GROUPS](),
    ]).catch((error) => {
      this.$bus.$emit(ALERT_EVENT_SHOW, {
        variant: DANGER,
        show: true,
        content: error?.message,
      });
    });
  },
};
</script>
