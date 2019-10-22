import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {store} from './store/store'
// Bootstrap
import BootstrapVue from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBookmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faBookmark)
Vue.component('font-awesome-icon', FontAwesomeIcon)

// Event bus
window.eventBus = new Vue();

Vue.use(BootstrapVue);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')