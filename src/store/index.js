import Vue from 'vue'
import Vuex from 'vuex'
import Resource from 'vue-resource'

Vue.use(Vuex)
Vue.use(Resource)

export default new Vuex.Store({
  state: {
    todayWeather: {},
    listToggleBtn:false,
    siderMenuBtn:true,
    headerH:0,
    maiHeaderH:0,
    browserH:0,
    addCityJudge:false,
    cityName:'',
    todoList:[]
  },
  mutations: {
  }
})
