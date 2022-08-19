import Vue from 'vue';
import router from './router';
import store from './store';

import { BootstrapVue } from 'bootstrap-vue';
import './plugins/vue-multiselect';
import VueEventBus from './plugins/vue-event-bus';

import App from './app.vue';
import './assets/styles/main.scss';

Vue.use(BootstrapVue);
Vue.use(VueEventBus);

Vue.config.devtools = true;
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#status-management');
