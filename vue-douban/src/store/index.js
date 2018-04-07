//vuex入口文件
import Vue from 'vue';
import Vuex from 'vuex';
import state from './state';
import mutations from './mutations';
import * as actions from './actions';
import * as getters from './getters';
import createLogger from 'vuex/dist/logger'//vuex调试器

Vue.use(Vuex);

//控制除生产环境外都使用严格模式
//严格模式可在除mutation外修改state时报错
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  strict:debug,
  plugins:debug?[createLogger()]:[] //打印每次mutation前后的信息
})