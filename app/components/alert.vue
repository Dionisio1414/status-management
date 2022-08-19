<template>
  <transition name="fade">
    <b-alert
      v-if="show"
      class="alert-default"
      :show="dismissCountDown"
      :variant="variant"
      dismissible
      @dismissed="$bus.$emit('alert::close')"
    >
      {{ content }}
    </b-alert>
  </transition>
</template>

<script>
export default {
  name: 'Alert',

  props: {
    variant: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    show: {
      type: Boolean,
      required: true,
    },
  },

  data: () => ({
    dismissCountDown: 5,
  }),
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease-out;
}

.fade-enter,
.fade-leave-to {
  transform: translateY(-25%);
  opacity: 0;
}
</style>
