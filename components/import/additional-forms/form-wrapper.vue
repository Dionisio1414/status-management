<template>
  <div class="additional-forms">
    <component :is="componentName" :loading="loading" />
  </div>
</template>

<script>
import {
  FormRock,
  FormStatus,
  FormPurchase,
} from '@/status-management/components/import/additional-forms/index';

export default {
  name: 'FormWrapper',

  components: {
    'form-status': FormStatus,
    'form-rock': FormRock,
    'form-purchase': FormPurchase,
  },

  props: {
    columnHandler: {
      type: [Object, null],
      required: true,
    },

    loading: {
      type: Boolean,
      required: true,
    },
  },

  computed: {
    componentName() {
      const key = this.columnHandler?.key;

      switch (key) {
        case 'isStatus':
          return 'form-status';
        case 'isRock':
          return 'form-rock';
        case 'isPurchase':
          return 'form-purchase';
        default:
          return null;
      }
    },
  },
};
</script>
