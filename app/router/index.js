import Vue from 'vue';
import VueRouter from 'vue-router';
import { routes } from './routes.js';

import { BASE_ROUTER_PATH } from '@/constants/base-router-path.js';

Vue.use(VueRouter);

const router = new VueRouter({
  base: BASE_ROUTER_PATH,
  mode: 'history',
  routes,
});

export default router;
