import Vue from 'vue'
import App from './App.vue'
import MuseUI from 'muse-ui'
import router from './router'
import 'muse-ui/dist/muse-ui.css'
import 'muse-ui/dist/theme-dark.css' // 使用 dark 主题
Vue.use(MuseUI)

new Vue({
  el: '#app',
  template: '<App/>',
  router,
  components: {
    App
  }
})
