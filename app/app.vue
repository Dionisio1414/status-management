<template>
  <div id="status-management">
    <router-view />

    <alert v-bind="alertProps" />

    <div class="modal-wrapper">
      <component
        :is="modalName"
        :modal-name="modalName"
        :show="show"
        :customProps="customProps"
      />
    </div>
  </div>
</template>

<script>
import Alert from '@/components/alert.vue';

import MixinAlert from '@/mixins/mixin-alert';
import MixinModal from './mixins/mixin-modal';

export default {
  name: 'App',

  mixins: [MixinAlert, MixinModal],

  components: { Alert },
};
</script>
