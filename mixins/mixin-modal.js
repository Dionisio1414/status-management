import {
  MODAL_CLOSE,
  MODAL_SHOW,
} from '@/status-management/constants/modals/modal-event-types';

export default {
  components: {
    'modal-select-columns': () =>
      import('@/status-management/components/modals/modal-select-columns.vue'),
    'modal-characteristics': () =>
      import('@/status-management/components/modals/modal-characteristics.vue'),
    'modal-action': () =>
      import('@/status-management/components/modals/modal-action.vue'),
    'modal-status-reasons': () =>
      import('@/status-management/components/modals/modal-status-reasons.vue'),
    'modal-comments': () =>
      import('@/status-management/components/modals/modal-comments.vue'),
    'modal-canceling-reason': () =>
      import(
        '@/status-management/components/modals/modal-canceling-reason.vue'
      ),
    'modal-logs': () =>
      import('@/status-management/components/modals/modal-logs.vue'),
    'modal-rock': () =>
      import('@/status-management/components/modals/modal-rock.vue'),
    'modal-import': () =>
      import('@/status-management/components/modals/modal-import.vue'),
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
