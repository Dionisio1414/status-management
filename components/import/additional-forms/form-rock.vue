<template>
  <b-card>
    <template #header>
      <h4 class="mb-0">Reasons form for <strong>Rock</strong></h4>
    </template>

    <b-form id="form-rock">
      <b-form-group
        class="default-form-group"
        label="Наценка:"
        label-for="profit"
      >
        <b-input-group append="%">
          <b-form-input
            :value="Number(forms.formRock.rock)"
            type="number"
            id="profit"
            class="form-control-default"
            :state="vv.$v.formRock.rock.$error ? false : null"
            :disabled="loading"
            placeholder="Наценка %"
            @change="
              onUpdateHandler({
                key: 'isRock',
                field: 'rock',
                value: Number($event),
              })
            "
          />
        </b-input-group>
      </b-form-group>

      <b-form-group
        class="default-form-group"
        label="Уровни:"
        label-for="levels"
      >
        <multiselect
          id="levels"
          :value="forms.formRock.level"
          :class="{ 'multiselect--error': vv.$v.formRock.level.$error }"
          :options="levelsOptions"
          :searchable="false"
          :show-labels="false"
          :allow-empty="false"
          :disabled="loading"
          :custom-label="customLabelLevels"
          placeholder="Выберите уровень наценки"
          @input="
            onUpdateHandler({ key: 'isRock', field: 'level', value: $event })
          "
        />
      </b-form-group>
    </b-form>
  </b-card>
</template>

<script>
import { mapActions } from '@modules/vuex';

import { LEVELS_LIST } from '@/status-management/constants/levels-list';

import { UPDATE_FORM, RESET_FORM } from '@/status-management/constants/store/import/action-types';

import { DEFAULT_ROCK_FORM } from '@/status-management/constants/import-default-forms';

export default {
  name: 'FormRock',

  props: {
    loading: {
      type: Boolean,
      required: true,
    },
  },

  inject: ['vv', 'forms', 'onResetValidation'],

  data: () => ({
    levelsList: LEVELS_LIST,
  }),

  computed: {
    levelsOptions() {
      return this.levelsList.map((item) => item.id);
    },
  },

  methods: {
    ...mapActions('import', [UPDATE_FORM, RESET_FORM]),

    onUpdateHandler(params) {
      this[UPDATE_FORM](params);

      this.onResetValidation();
    },

    customLabelLevels(id) {
      const option = this.levelsList.find((item) => item.id === id);

      return option?.name || '';
    },
  },

  destroyed() {
    this[RESET_FORM]({ key: 'isRock', value: DEFAULT_ROCK_FORM });
  },
};
</script>
