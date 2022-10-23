<template>
  <div class="default-layout">
    <div class="default-layout__filters" v-if="hasSlot('filters')">
      <slot name="filters" />
    </div>
    <div class="default-layout__actions" v-if="hasSlot('actions')">
      <slot name="actions" />
    </div>
    <div class="default-layout__main" v-if="hasSlot()">
      <slot />
    </div>
  </div>
</template>

<script>
import mixinSlot from '@/status-management/mixins/mixin-slot.js';

export default {
  name: 'DefaultLayout',
  mixins: [mixinSlot],
};
</script>
