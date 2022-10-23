<template>
  <div class="comments-list" ref="comments-list">
    <b-skeleton-wrapper :loading="loading">
      <template #loading>
        <b-skeleton animation="wave" width="65%" />
        <b-skeleton animation="wave" width="100%" />
        <b-skeleton animation="wave" width="65%" />
        <b-skeleton animation="wave" width="100%" />
        <b-skeleton animation="wave" width="65%" />
        <b-skeleton animation="wave" width="100%" />
        <b-skeleton animation="wave" width="65%" />
        <b-skeleton animation="wave" width="100%" />
      </template>

      <template v-if="comments.length">
        <div
          class="comments-list__item"
          :class="{
            'comments-list__item--last': index === comments.length - 1,
          }"
          v-for="(comment, index) in comments"
          :key="index"
        >
          <div class="comments-list__info">
            <time :datetime="comment.date" class="comments-list__info--date">
              {{ comment.date }}
            </time>

            <span class="comments-list__info--name">{{ comment.user }}</span>
          </div>

          <div class="comments-list__text" v-html="comment.text" />
        </div>
      </template>

      <template v-else>
        <div class="text-center">There are no comments.</div>
      </template>
    </b-skeleton-wrapper>
  </div>
</template>

<script>
export default {
  name: 'CommentsList',

  props: {
    comments: {
      type: [Array, String],
      required: true,
      default: () => {
        return [];
      },
    },

    loading: {
      type: Boolean,
      required: true,
      default: false,
    },
  },

  methods: {
    async onScrollToBottom() {
      const commentsList = this.$refs['comments-list'];
      const isScroll = commentsList.scrollHeight > commentsList.clientHeight;
      const el = this.$el.querySelector('.comments-list__item--last');

      await this.$nextTick();

      if (el && isScroll) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.comments-list {
  max-height: 30rem;
  overflow-x: hidden;
  overflow-y: auto;
  border-bottom: 0.2rem solid #ced4da;
  padding-bottom: 2rem;
  &__item {
    padding-right: 1rem;
    &:not(:last-child) {
      margin-bottom: 1.5rem;
    }
  }

  &__info {
    font-size: 1.2rem;
    margin-bottom: 0.35rem;
  }

  &__text {
    font-size: 1.3rem;
    background: #f8f9fa;
    border-radius: $border-radius;
    border: 0.1rem solid #dee2e6;
    padding: 1rem;
  }
}
</style>
