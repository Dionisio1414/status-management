import { MODAL_CLOSE, MODAL_SHOW } from '@/constants/modals/modal-event-types';

export default {
  components: {
    'modal-select-columns': () =>
      import('@/components/modals/modal-select-columns.vue'),
    'modal-characteristics': () =>
      import('@/components/modals/modal-characteristics.vue'),
    'modal-action': () => import('@/components/modals/modal-action.vue'),
    'modal-status-reasons': () =>
      import('@/components/modals/modal-status-reasons.vue'),
    'modal-comments': () => import('@/components/modals/modal-comments.vue'),
    'modal-canceling-reason': () =>
      import('@/components/modals/modal-canceling-reason.vue'),
    'modal-logs': () => import('@/components/modals/modal-logs.vue'),
  },

  data: () => ({
    modalName: null,
    show: false,

    customProps: {},
  }),

  beforeDestroy() {
    this.$bus.$off();
  },

  mounted() {
    this.$bus.$on(MODAL_SHOW, ({ modalName, show, customProps = {} }) => {
      this.modalName = modalName;
      this.show = show;
      this.customProps = customProps;
    });

    this.$bus.$on(MODAL_CLOSE, (callback) => {
      this.modalName = null;
      this.show = false;
      this.customProps = {};

      if (callback) callback();
    });
  },
};
