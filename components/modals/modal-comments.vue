<template>
  <b-modal
    :id="modalName"
    :visible="show"
    static
    scrollable
    @hidden="closeHandler"
  >
    <template #modal-header="{ close }">
      <div class="d-flex align-items-center w-100">
        <h3 class="modal-title">Comments</h3>
        <button
          type="button"
          style="font-size: 2rem"
          class="close"
          @click="close"
        >
          ×
        </button>
      </div>
    </template>

    <template #default>
      <comments-list
        ref="comments"
        class="mb-3"
        :loading="loading"
        :comments="comments"
      />

      <b-form id="form-comments" @submit.prevent="applyFormHandler">
        <b-form-group
          class="default-form-group"
          label="Комментарий:"
          label-for="textarea-comment"
        >
          <multiselect
            id="group-tags"
            class="mb-3"
            v-model="form.groups"
            tag-placeholder="Выберите группу"
            :options="groupsOptions"
            :searchable="false"
            :show-labels="false"
            :allow-empty="false"
            :multiple="true"
            :taggable="true"
            :disabled="loading"
            :custom-label="customLabelGroups"
          />
          <b-form-textarea
            ref="textarea-comment"
            v-model.trim="form.msg"
            id="textarea-comment"
            class="form-control-default"
            :state="$v.form.msg.$error ? false : null"
            placeholder="Комментарий"
            :disabled="loading"
            @keyup.ctrl.enter.exact="applyFormHandler"
          />
        </b-form-group>
      </b-form>
    </template>

    <template #modal-footer="{ hide }">
      <div class="d-flex align-items-center justify-content-between w-100">
        <b-button
          type="submit"
          form="form-comments"
          class="btn--default"
          variant="primary"
          :disabled="loading"
        >
          Send (CTRL+↵)
        </b-button>

        <b-button
          class="btn--default"
          variant="outline-secondary"
          :disabled="loading"
          @click="hide"
        >
          Cancel
        </b-button>
      </div>
    </template>
  </b-modal>
</template>

<script>
import { mapActions, mapState } from '@modules/vuex';
import { validationMixin } from '@modules/vuelidate';

import { required } from '@modules/vuelidate/lib/validators';

import CommentsList from '@/status-management/components/comments-list.vue';

import { MODAL_CLOSE } from '@/status-management/constants/modals/modal-event-types';
import {
  GET_PRODUCT_COMMENTS,
  ADD_PRODUCT_COMMENT,
} from '@/status-management/constants/store/product/action-types';

import { ALERT_EVENT_SHOW } from '@/status-management/constants/alert/alert-event-types';
import { SUCCESS, DANGER } from '@/status-management/constants/alert/alert-types';

export default {
  name: 'ModalComments',

  components: { CommentsList },

  mixins: [validationMixin],

  validations: {
    form: {
      msg: { required },
    },
  },

  props: {
    modalName: {
      type: String,
      required: true,
    },

    show: {
      type: Boolean,
      required: true,
    },

    customProps: {
      type: Object,
      required: true,
    },
  },

  data: () => ({
    form: {
      msg: null,
      groups: null,
    },
  }),

  computed: {
    ...mapState('product', {
      comments: (state) => state.productComments,
      groups: (state) => state.commentsGroups.groups,
      defaultGroups: (state) => state.commentsGroups.default,
      loading: (state) => state.loading,
    }),

    groupsList() {
      return Object.entries(this.groups).map(([id, name]) => ({
        id: Number(id),
        name,
      }));
    },

    groupsOptions() {
      return this.groupsList.map((item) => item.id);
    },
  },

  methods: {
    ...mapActions('product', [GET_PRODUCT_COMMENTS, ADD_PRODUCT_COMMENT]),

    async applyFormHandler() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        try {
          const formData = new FormData();

          formData.append('id', this.customProps.id);
          formData.append('msg', this.form.msg);
          formData.append('groups', this.form.groups);

          await this[ADD_PRODUCT_COMMENT](formData);

          this.$refs.comments.onScrollToBottom();
          this.form.msg = null;
          this.$v.$reset();

          this.$bus.$emit(ALERT_EVENT_SHOW, {
            variant: SUCCESS,
            show: true,
            content: 'Successfully comment added',
          });
        } catch (error) {
          this.$bus.$emit(ALERT_EVENT_SHOW, {
            variant: DANGER,
            show: true,
            content: error?.message,
          });
        }
      }
    },

    closeHandler(callback) {
      const typeCallback = callback.vueTarget
        ? callback.vueTarget.hide
        : callback;

      this.$bus.$emit(MODAL_CLOSE, typeCallback);
    },

    customLabelGroups(id) {
      const option = this.groupsList.find((item) => item.id === id);

      return option?.name || '';
    },
  },

  async created() {
    try {
      await this[GET_PRODUCT_COMMENTS](this.customProps.id);

      this.form.groups = this.defaultGroups?.length ? this.defaultGroups : null;
      this.$refs['textarea-comment'].focus();
    } catch (error) {
      this.$bus.$emit(ALERT_EVENT_SHOW, {
        variant: DANGER,
        show: true,
        content: error?.message,
      });
    }
  },
};
</script>
