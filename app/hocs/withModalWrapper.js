export const withModalWrapper = (props = {}) => {
  return {
    functional: true,
    render(h, ctx) {
      return h('div', { class: 'modal-wrapper' }, [
        ctx.scopedSlots.default(props),
      ]);
    },
  };
};
