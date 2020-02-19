import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'lib-flexible/flexible'
import axios from 'axios'
import VueAxios from 'vue-axios'

import { 

  Toast,
  Tab,
  Tabs,
  Pagination,
  Sidebar, 
  SidebarItem

} from 'vant'

Vue
  .use(Toast)
  .use(Tab)
  .use(Tabs)
  .use(Pagination)
  .use(Sidebar)
  .use(SidebarItem)


Vue.config.productionTip = false

Vue.use(VueAxios, axios)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
