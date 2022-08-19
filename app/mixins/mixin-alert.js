import {
  ALERT_EVENT_SHOW,
  ALERT_EVENT_CLOSE,
} from '@/constants/alert/alert-event-types';

export default {
  data: () => ({
    alertProps: {
      show: false,
      content: '',
      variant: '',
    },
  }),

  methods: {
    onShowHandler() {
      this.alertProps.show = true;
    },

    onCloseHandler() {
      this.alertProps.show = false;
    },
  },

  beforeDestroy() {
    this.$bus.$off();
  },

  mounted() {
    this.$bus.$on(ALERT_EVENT_SHOW, ({ show, content, variant }) => {
      this.alertProps.show = show;
      this.alertProps.content = content;
      this.alertProps.variant = variant;
    });

    this.$bus.$on(ALERT_EVENT_CLOSE, () => {
      this.alertProps.show = false;
      this.alertProps.content = '';
      this.alertProps.variant = '';
    });
  },
};
