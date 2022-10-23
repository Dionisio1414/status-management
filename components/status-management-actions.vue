<template>
  <b-container class="mb-4">
    <b-row class="align-items-center">
      <b-col cols="10" class="align-self-end">
        <div class="d-flex align-items-center">
          <b-button
            class="btn--default mr-5"
            variant="success"
            :disabled="loading"
            @click="
              $bus.$emit('modal::show', {
                modalName: modalImport,
                show: true,
                customProps: {},
              })
            "
          >
            Import
          </b-button>
          <span
            class="font-weight-bold mr-3"
            style="font-size: 1.5rem; line-height: 1"
          >
            Mass update:
          </span>
          <span id="isStatus">
            <b-dropdown
              class="btn-group-default"
              variant="danger"
              text="Статус на сайте"
              :disabled="loading || !selectedRows.length"
            >
              <b-dropdown-item
                @click="
                  $bus.$emit('modal::show', {
                    modalName: modalAction,
                    show: true,
                    customProps: {
                      title: 'Запустить включение на сайте <b>На скине</b>',
                      description:
                        'Запустить включение на сайте <b>На скине</b>?',
                      type: 'isStatus',
                      checked: true,
                      isMassUpdate: true,
                    },
                  })
                "
              >
                Включить на сайте
              </b-dropdown-item>
              <b-dropdown-item
                @click="
                  $bus.$emit('modal::show', {
                    modalName: modalStatusReasons,
                    show: true,
                    customProps: {
                      title: 'Заупустить отключение на сайте <b>На скине</b>',
                      type: 'isStatus',
                      checked: true,
                      isMassUpdate: true,
                    },
                  })
                "
              >
                Отключить на сайте
              </b-dropdown-item>
            </b-dropdown>
          </span>

          <span id="isRock">
            <b-dropdown
              class="btn-group-default"
              variant="success"
              text="Неликвид"
              :disabled="loading || !selectedRows.length"
            >
              <b-dropdown-item
                @click="
                  $bus.$emit('modal::show', {
                    modalName: modalRock,
                    show: true,
                    customProps: {
                      title: 'Запустить включение <b>Неликвид</b>',
                      description: 'Запустить включение <b>Неликвид</b>?',
                      type: 'isRock',
                      checked: true,
                      isMassUpdate: true,
                    },
                  })
                "
              >
                Включить на сайте
              </b-dropdown-item>
              <b-dropdown-item
                @click="
                  $bus.$emit('modal::show', {
                    modalName: modalAction,
                    show: true,
                    customProps: {
                      title: 'Запустить отключение <b>Неликвид</b>',
                      description: 'Запустить отключение <b>Неликвид</b>?',
                      type: 'isRock',
                      checked: false,
                      isMassUpdate: true,
                    },
                  })
                "
              >
                Отключить на сайте
              </b-dropdown-item>
            </b-dropdown>
          </span>

          <span id="isPurchase">
            <b-dropdown
              class="btn-group-default"
              variant="primary"
              text="К заказу"
              :disabled="loading || !selectedRows.length"
            >
              <b-dropdown-item
                @click="
                  $bus.$emit('modal::show', {
                    modalName: modalAction,
                    show: true,
                    customProps: {
                      title: 'Запустить включение <b>К Заказу</b>',
                      description: 'Запустить включение <b>К Заказу</b>?',
                      type: 'isPurchase',
                      checked: true,
                    },
                  })
                "
              >
                Включить на сайте
              </b-dropdown-item>
              <b-dropdown-item
                @click="
                  $bus.$emit('modal::show', {
                    modalName: modalCancelingReason,
                    show: true,
                    customProps: {
                      title: 'Запустить отключение <b>К Заказу</b>',
                      description: 'Запустить отключение <b>К Заказу</b>?',
                      type: 'isPurchase',
                      checked: false,
                      isMassUpdate: true,
                    },
                  })
                "
              >
                Отключить на сайте
              </b-dropdown-item>
            </b-dropdown>
          </span>

          <span id="isRequiresCertification">
            <b-dropdown
              class="btn-group-default"
              variant="success"
              text="Требует сертификации"
              :disabled="loading || !selectedRows.length"
            >
              <b-dropdown-item
                @click="
                  $bus.$emit('modal::show', {
                    modalName: modalAction,
                    show: true,
                    customProps: {
                      title: 'Запустить включение <b>Требует сертификации</b>',
                      description:
                        'Запустить включение <b>Требует сертификации</b>?',
                      type: 'isRequiresCertification',
                      checked: true,
                    },
                  })
                "
              >
                Включить на сайте
              </b-dropdown-item>
              <b-dropdown-item
                @click="
                  $bus.$emit('modal::show', {
                    modalName: modalAction,
                    show: true,
                    customProps: {
                      title: 'Запустить отключение <b>Требует сертификации</b>',
                      description:
                        'Запустить отключение <b>Требует сертификации</b>?',
                      type: 'isRequiresCertification',
                      checked: false,
                    },
                  })
                "
              >
                Отключить на сайте
              </b-dropdown-item>
            </b-dropdown>
          </span>

          <span id="isPattern">
            <b-dropdown
              class="btn-group-default"
              variant="primary"
              text="Запатентован"
              :disabled="loading || !selectedRows.length"
            >
              <b-dropdown-item
                @click="
                  $bus.$emit('modal::show', {
                    modalName: modalAction,
                    show: true,
                    customProps: {
                      title: 'Запустить включение <b>Запатентован</b>',
                      description: 'Запустить включение <b>Запатентован</b>?',
                      type: 'isPattern',
                      checked: true,
                    },
                  })
                "
              >
                Включить на сайте
              </b-dropdown-item>
              <b-dropdown-item
                @click="
                  $bus.$emit('modal::show', {
                    modalName: modalAction,
                    show: true,
                    customProps: {
                      title: 'Запустить отключение <b>Запатентован</b>',
                      description: 'Запустить отключение <b>Запатентован</b>?',
                      type: 'isPattern',
                      checked: false,
                    },
                  })
                "
              >
                Отключить на сайте
              </b-dropdown-item>
            </b-dropdown>
          </span>

          <template v-if="!selectedRows.length">
            <b-tooltip
              v-for="val in actionTypes"
              :target="val"
              :key="val"
              triggers="hover"
              title="You must select at least one product"
            />
          </template>
        </div>
      </b-col>
      <b-col>
        <div class="d-flex justify-content-end">
          <b-button
            class="btn--default"
            variant="primary"
            :disabled="loading"
            @click="
              $bus.$emit('modal::show', {
                modalName: modalSelectColumns,
                show: true,
              })
            "
          >
            Columns
          </b-button>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState } from '@modules/vuex';

import {
  MODAL_SELECT_COLUMNS,
  MODAL_ACTION,
  MODAL_STATUS_REASONS,
  MODAL_CANCELING_REASONS,
  MODAL_ROCK,
  MODAL_IMPORT,
} from '@/status-management/constants/modals/modal-ids.js';

export default {
  name: 'StatusManagementActions',

  props: {
    loading: {
      type: Boolean,
      requried: true,
      default: false,
    },
  },

  data: () => ({
    modalSelectColumns: MODAL_SELECT_COLUMNS,
    modalAction: MODAL_ACTION,
    modalStatusReasons: MODAL_STATUS_REASONS,
    modalCancelingReason: MODAL_CANCELING_REASONS,
    modalRock: MODAL_ROCK,
    modalImport: MODAL_IMPORT,

    actionTypes: [
      'isStatus',
      'isRock',
      'isPurchase',
      'isRequiresCertification',
      'isPattern',
    ],
  }),

  computed: {
    ...mapState('productList', {
      selectedRows: (state) => state.table.selectedRows,
    }),
  },
};
</script>
