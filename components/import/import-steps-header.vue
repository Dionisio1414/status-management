<template>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb breadcrumb--default justify-content-center">
      <li class="breadcrumb-item font-weight-bold" aria-current="page">
        Steps:
      </li>

      <li
        class="breadcrumb-item"
        :class="{
          active: breadcrumb.step === step,
          'font-weight-bold': breadcrumb.step === step,
        }"
        v-for="(breadcrumb, index) in breadcrumbs"
        :key="index"
      >
        {{ breadcrumb.text }}
      </li>
    </ol>
  </nav>
</template>

<script>
import breadcrumbs from '@/status-management/constants/import-breadcrumbs';

export default {
  name: 'ImportStepsHeader',

  props: {
    step: {
      type: Number,
      required: true,
    },
  },

  data: () => ({
    breadcrumbs,
  }),
};
</script>
