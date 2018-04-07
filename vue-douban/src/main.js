// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'//支持es6高级api如promise
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'
import 'common/stylus/index.styl'; // 引入样式表
import store from './store'//引入vuex

fastclick.attach(document.body)

//将vue-lazyload绑定到所有组件上
Vue.use(VueLazyLoad,{
  loading:require('./common/image/loading.gif')
})

Vue.config.productionTip = false//关闭生产环境的提示

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store
})
