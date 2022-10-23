import Vue from '@modules/vue'
import VueRouter from '@modules/vue-router';
import { routes } from './routes.js';

import { BASE_ROUTER_PATH } from '@/status-management/constants/base-router-path.js';

Vue.use(VueRouter);

const router = new VueRouter({
  base: BASE_ROUTER_PATH,
  mode: 'history',
  routes,
});

export default router;
