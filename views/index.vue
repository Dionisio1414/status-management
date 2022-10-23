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
import { mapActions, mapState } from '@modules/vuex';

import DefaultLayout from '@/status-management/layouts/default-layout.vue';
import StatusManagementFilters from '@/status-management/components/status-management-filters.vue';
import StatusManagementActions from '@/status-management/components/status-management-actions.vue';
import StatusManagementTable from '@/status-management/components/status-management-table.vue';

import { GET_PRODUCTS } from '@/status-management/constants/store/product-list/action-types';
import { GET_CATEGORIES } from '@/status-management/constants/store/main-filters/action-types';
import { GET_PURSCHASE_REASONS } from '@/status-management/constants/store/reasons/action-types';
import { GET_COMMENTS_GROUPS } from '@/status-management/constants/store/product/action-types';

import { ALERT_EVENT_SHOW } from '@/status-management/constants/alert/alert-event-types';
import { DANGER } from '@/status-management/constants/alert/alert-types';

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
