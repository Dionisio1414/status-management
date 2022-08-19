<template>
  <b-container>
    <b-row>
      <b-col>
        <div class="table-responsive table-responsive--radius">
          <b-table
            class="table-data"
            :class="{ 'table-data--disabled': productLoading }"
            :fields="visibleFields"
            :items="products"
            :current-page="page"
            :busy="loading"
            outlined
            striped
            bordered
            show-empty
          >
            <template #table-busy>
              <div class="text-center text-danger my-2">
                <b-spinner label="Loading..." variant="dark" />
              </div>
            </template>

            <template #head(selected)>
              <b-form-checkbox
                class="default-checkbox"
                v-model="isAllSelected"
                plain
                @change="onAllCheckedHandler"
              />
            </template>

            <template #cell(selected)="{ item }">
              <b-form-checkbox
                v-model="selectedRowsList"
                class="default-checkbox"
                plain
                :value="item"
              />
            </template>

            <template #cell(skin)="data">
              <b-button
                class="btn--default"
                :variant="data.item.status ? 'danger' : 'success'"
                @click="
                  onSwitchHandler({
                    type: 'isStatus',
                    checked: Boolean(data.item.status) ? false : true,
                    starkId: data.item.id,
                    articleId: data.item.articleId,
                    title: data.item.articleNo,
                  })
                "
              >
                {{ data.item.status ? 'Отключить' : 'Включить' }}
              </b-button>
            </template>

            <template #cell(product_id)="data">
              <div class="d-flex align-items-center" style="gap: 1rem">
                <b-button
                  class="btn--default"
                  variant="link"
                  :href="data.item.articleLink"
                  target="_blank"
                >
                  {{ data.item.articleId }}
                </b-button>

                <b-button
                  class="btn--default p-0 bg-transparent border-0"
                  @click="
                    $bus.$emit('modal::show', {
                      modalName: modalCommentsName,
                      show: true,
                      customProps: {
                        id: data.item.id,
                      },
                    })
                  "
                >
                  <b-badge class="badge--default" variant="danger">
                    <font-awesome-icon icon="info" />
                  </b-badge>
                </b-button>

                <b-button class="btn--default p-0 bg-transparent border-0">
                  <b-badge
                    class="badge--default"
                    variant="warning"
                    style="color: #fff"
                    @click="
                      $bus.$emit('modal::show', {
                        modalName: modalLogsName,
                        show: true,
                        customProps: {
                          title: data.item.categoryName,
                          id: data.item.id,
                        },
                      })
                    "
                  >
                    H
                  </b-badge>
                </b-button>
              </div>
            </template>

            <template #cell(brand_name)="data">
              <div v-html="$options.filters.columnValue(data.item.brandName)" />
            </template>

            <template #cell(article_no)="data">
              <div class="d-flex align-items-center" style="gap: 1rem">
                <b-button
                  class="btn--default"
                  variant="link"
                  :href="data.item.articleLink"
                  target="_blank"
                >
                  {{ data.item.articleNo }}
                </b-button>

                <b-button
                  :id="`popover-${data.index}`"
                  class="btn--default p-0 bg-transparent border-0"
                  style="color: #000"
                  :disabled="!data.item.imageLink"
                >
                  <font-awesome-icon icon="camera-retro" />
                </b-button>

                <b-button
                  class="btn--default p-0 bg-transparent border-0"
                  style="color: #17a2b8"
                  @click="
                    $bus.$emit('modal::show', {
                      modalName: modalCharacteristicsName,
                      show: true,
                      customProps: {
                        title: data.item.categoryName,
                        id: data.item.articleId,
                      },
                    })
                  "
                >
                  <font-awesome-icon icon="cog" />
                </b-button>

                <b-popover
                  v-if="data.item.imageLink"
                  custom-class="default-popover"
                  :target="`popover-${data.index}`"
                  triggers="hover"
                >
                  <b-img-lazy
                    :src="data.item.imageLink"
                    fluid
                    thumbnail
                    :alt="data.item.articleNo"
                  />
                </b-popover>
              </div>
            </template>

            <template #cell(category_id)="data">
              <b-button
                v-if="data.item.categoryId"
                class="btn--default"
                variant="link"
                :href="data.item.categoryLink"
                target="_blank"
              >
                {{ data.item.categoryId }}
              </b-button>

              <div
                v-else
                v-html="$options.filters.columnValue(data.item.categoryId)"
              />
            </template>

            <template #cell(category_name)="data">
              <b-button
                v-if="data.item.categoryName"
                class="btn--default"
                variant="link"
                :href="data.item.categoryLink"
                target="_blank"
              >
                {{ data.item.categoryName }}
              </b-button>

              <div
                v-else
                v-html="$options.filters.columnValue(data.item.categoryName)"
              />
            </template>

            <template #cell(main_oe)="data">
              <div v-html="$options.filters.columnValue(data.item.currentOE)" />
            </template>

            <template #cell(main_tn)="data">
              <div v-html="$options.filters.columnValue(data.item.currentTN)" />
            </template>

            <template #cell(price)="data">
              <div
                v-if="data.item.price"
                class="d-flex align-items-center"
                style="gap: 1rem"
              >
                {{ data.item.price }}

                <b-button
                  class="btn--default p-0 bg-transparent border-0"
                  style="color: #000"
                  @click="onChangePriceHandler(data.item.articleId)"
                >
                  <font-awesome-icon icon="sync" />
                </b-button>
              </div>

              <div
                v-else
                v-html="$options.filters.columnValue(data.item.price)"
              />
            </template>

            <template #cell(price_netto)="data">
              <div v-html="$options.filters.columnValue(data.item.priceNet)" />
            </template>

            <template #cell(profit)="data">
              <div v-html="$options.filters.profitValue(data.item.profit)" />
            </template>

            <template #cell(label_abc)="data">
              <div v-html="$options.filters.columnValue(data.item.abcLabel)" />
            </template>

            <template #cell(mark_rating)="data">
              <div
                v-html="$options.filters.columnValue(data.item.marketingRating)"
              />
            </template>

            <template #cell(heavy_truck)="data">
              {{ Boolean(+data.item.isSurcharge) ? 'Yes' : 'No' }}
            </template>

            <template #cell(to_order)="data">
              <b-form-checkbox
                switch
                size="lg"
                :checked="Boolean(+data.item.isPurchase)"
                @click.native.prevent="
                  onSwitchHandler({
                    type: 'isPurchase',
                    checked: Boolean(+data.item.isPurchase) ? false : true,
                    starkId: data.item.id,
                    articleId: data.item.articleId,
                  })
                "
              />
            </template>

            <template #cell(patented)="data">
              <b-form-checkbox
                switch
                size="lg"
                :checked="Boolean(+data.item.isPattern)"
                @click.native.prevent="
                  onSwitchHandler({
                    type: 'isPattern',
                    checked: Boolean(+data.item.isPattern) ? false : true,
                    starkId: data.item.id,
                    articleId: data.item.articleId,
                  })
                "
              />
            </template>

            <template #cell(certification)="data">
              <b-form-checkbox
                switch
                size="lg"
                :checked="Boolean(+data.item.isRequiresCertification)"
                @click.native.prevent="
                  onSwitchHandler({
                    type: 'isRequiresCertification',
                    checked: Boolean(+data.item.isRequiresCertification)
                      ? false
                      : true,
                    starkId: data.item.id,
                    articleId: data.item.articleId,
                  })
                "
              />
            </template>

            <template #cell(label_unliquid)="data">
              <b-form-checkbox
                switch
                size="lg"
                :checked="Boolean(+data.item.isRock)"
                @click.native.prevent="
                  onSwitchHandler({
                    type: 'isRock',
                    checked: Boolean(+data.item.isRock) ? false : true,
                    starkId: data.item.id,
                    articleId: data.item.articleId,
                  })
                "
              />
            </template>

            <template #cell(original_product)="data">
              <b-button
                v-if="Boolean(data.item.originalProduct.trim())"
                class="btn--default"
                variant="link"
                :href="data.item.originalProductLink"
                taget="_blank"
              >
                {{ data.item.originalProduct }}
              </b-button>

              <div
                v-else
                v-html="$options.filters.columnValue(data.item.originalProduct)"
              />
            </template>

            <template #cell(product_price)="data">
              <div
                v-html="$options.filters.columnValue(data.item.priceProduct)"
              />
            </template>

            <template #cell(weight)="data">
              <div v-html="$options.filters.columnValue(data.item.weight)" />
            </template>

            <template #cell(in_stock)>
              <div class="font-weight-bold">&#8212;</div>
            </template>

            <template #cell(in_reserve)>
              <div class="font-weight-bold">&#8212;</div>
            </template>
          </b-table>
        </div>

        <div class="d-flex align-items-center justify-content-center">
          <b-pagination
            class="pagination-default mx-auto"
            :value="page"
            :total-rows="totalPages"
            :per-page="perPage"
            prev-text="Prev"
            next-text="Next"
            first-number
            last-number
            :disabled="loading"
            @change="
              onChangeHandler({ key: 'page', value: $event, isParams: true })
            "
          />

          <multiselect
            :value="perPage"
            :options="perPageOptions"
            :searchable="false"
            :show-labels="false"
            :allow-empty="false"
            :disabled="loading"
            placeholder="Выберите поле"
            style="max-width: 7rem"
            @select="
              onChangeHandler({ key: 'perPage', value: $event, isParams: true })
            "
          />
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCog,
  faCameraRetro,
  faInfo,
  faSync,
} from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import PER_PAGE_TABLE from '@/constants/per-page-table';
import {
  UPDATE_TABLE,
  REGENERATE_PRICE_PRODUCT,
} from '@/constants/store/product-list/action-types';
import { UPDATE_PRODUCT } from '@/constants/store/product/action-types';

import {
  MODAL_CHARACTERISTICS,
  MODAL_COMMENTS,
  MODAL_CANCELING_REASONS,
  MODAL_LOGS,
  MODAL_STATUS_REASONS,
} from '@/constants/modals/modal-ids';

import { ALERT_EVENT_SHOW } from '@/constants/alert/alert-event-types';
import { SUCCESS, DANGER } from '@/constants/alert/alert-types';
import { MODAL_SHOW } from '@/constants/modals/modal-event-types';

library.add(faCog, faCameraRetro, faInfo, faSync);

export default {
  name: 'StatusManagementTable',

  components: { FontAwesomeIcon },

  props: {
    loading: {
      type: Boolean,
      requried: true,
      default: false,
    },
  },

  filters: {
    columnValue(value) {
      return value?.trim()
        ? value
        : '<span class="font-weight-bold">&#8212;</span>';
    },

    profitValue(value) {
      return value
        ? `${value}%`
        : '<span class="font-weight-bold">&#8212;</span>';
    },
  },

  data: () => ({
    isAllSelected: false,
    perPageOptions: PER_PAGE_TABLE,
    modalCharacteristicsName: MODAL_CHARACTERISTICS,
    modalCommentsName: MODAL_COMMENTS,
    modalCancelingReasonName: MODAL_CANCELING_REASONS,
    modalLogsName: MODAL_LOGS,
    modalStatusReasons: MODAL_STATUS_REASONS,
  }),

  computed: {
    ...mapState('productList', {
      products: (state) => state.products,
      page: (state) => state.table.params.page,
      perPage: (state) => state.table.params.perPage,
      totalPages: (state) => state.table.totalPages,
      fields: (state) => state.table.fields,
      selectedRows: (state) => state.table.selectedRows,
    }),

    ...mapState('product', {
      productLoading: (state) => state.loading,
    }),

    visibleFields() {
      return this.fields.filter((field) => field.visible);
    },

    selectedRowsList: {
      get() {
        return this.selectedRows;
      },

      set(value) {
        this[UPDATE_TABLE]({ key: 'selectedRows', value, isParams: false });
      },
    },
  },

  methods: {
    ...mapActions('productList', [UPDATE_TABLE, REGENERATE_PRICE_PRODUCT]),
    ...mapActions('product', [UPDATE_PRODUCT]),

    onAllCheckedHandler() {
      if (this.isAllSelected) {
        this[UPDATE_TABLE]({
          key: 'selectedRows',
          value: this.products,
          isParams: false,
        });
      } else {
        this[UPDATE_TABLE]({
          key: 'selectedRows',
          value: [],
          isParams: false,
        });
      }
    },

    onChangeHandler(value) {
      if (value.key === 'perPage') {
        this[UPDATE_TABLE]({ key: 'page', value: 1, isParams: true });
        this[UPDATE_TABLE](value);

        this.$emit('update-data');
      } else {
        this[UPDATE_TABLE](value);

        this.$emit('update-data');
      }
    },

    onDisableModalHandler(data, formData) {
      switch (data.type) {
        case 'isPurchase':
        case 'isRock':
          this.$bus.$emit(MODAL_SHOW, {
            modalName: this.modalCancelingReasonName,
            show: true,
            customProps: { ...data },
          });
          break;
        case 'isStatus':
          this.$bus.$emit(MODAL_SHOW, {
            modalName: this.modalStatusReasons,
            show: true,
            customProps: { ...data },
          });
          break;
        default:
          this.updateProductHandler(formData);
      }
    },

    onSwitchHandler(data) {
      const formData = new FormData();

      formData.append('type', data.type);
      formData.append('id', data.starkId);

      if (data.checked) {
        formData.append('enable', 1);
        this.updateProductHandler(formData);
      }

      if (!data.checked) {
        formData.append('enable', 0);
        this.onDisableModalHandler(data, formData);
      }
    },

    async updateProductHandler(formData) {
      try {
        await this[UPDATE_PRODUCT](formData);

        this.$bus.$emit(ALERT_EVENT_SHOW, {
          variant: SUCCESS,
          show: true,
          content: 'Successfully updated product',
        });
      } catch (error) {
        this.$bus.$emit(ALERT_EVENT_SHOW, {
          variant: DANGER,
          show: true,
          content: error?.message,
        });
      }
    },

    async onChangePriceHandler(id) {
      try {
        await this[REGENERATE_PRICE_PRODUCT](id);

        this.$bus.$emit(ALERT_EVENT_SHOW, {
          variant: SUCCESS,
          show: true,
          content: 'Price was regenerated',
        });
      } catch (error) {
        this.$bus.$emit(ALERT_EVENT_SHOW, {
          variant: DANGER,
          show: true,
          content: error?.message,
        });
      }
    },
  },

  watch: {
    selectedRowsList(value) {
      value.length === this.products.length
        ? (this.isAllSelected = true)
        : (this.isAllSelected = false);
    },
    immediate: true,
  },
};
</script>
