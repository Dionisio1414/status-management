import axios from '@modules/axios';

import { DEFAULT_CONTENT_TYPE } from '@/status-management/constants/api';
class ApiService {
  constructor(
    baseURL,
    responseType = null,
    contentType = DEFAULT_CONTENT_TYPE
  ) {
    this.$http = axios.create({
      baseURL,
      headers: {
        'content-type': contentType,
      },
      responseType,
    });
  }

  async getProducts(params = {}) {
    const response = await this.$http.get('loadTable', {
      params,
    });

    return response.data;
  }

  async getCategories() {
    const response = await this.$http.get('categoryList');

    return response.data;
  }

  async regenerateProductPrice(id) {
    const response = await this.$http.post(`regenerate/${id}`);

    return response.data;
  }

  async getProductCharacteristics(id) {
    const response = await this.$http.get(`additionalInfo/${id}`);

    return response.data;
  }

  async getProductLogs(id) {
    const response = await this.$http.get(`productLog/${id}`);

    return response.data;
  }

  async getProductComments(id) {
    const response = await this.$http.get(`comment/${id}`);

    return response.data;
  }

  async getPurchaseReasons() {
    const response = await this.$http.get('purchaseCause');

    return response.data;
  }

  async updateProduct(params) {
    const response = await this.$http.post('updateProduct', params);

    return response.data;
  }

  async getCommentsGroups() {
    const response = await this.$http.get('commentsGroups');

    return response.data;
  }

  async addProductComment(params) {
    const response = await this.$http.post('add', params);

    return response.data;
  }

  async exportProducts(params) {
    const response = await this.$http.get('export', { params });

    return response.data;
  }

  async deletePriceRock(id) {
    const response = await this.$http.post(`delete/${id}`);

    return response.data;
  }

  async uploadFile(params) {
    const response = await this.$http.post('upload-file', params);

    return response.data;
  }

  async updateByFile(params) {
    const response = await this.$http.post('update-by-file', params);

    return response.data;
  }
}

export default ApiService;
