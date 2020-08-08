import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import {menuModule} from './menuStore/modules'

export default new Vuex.Store({
  modules: {
    menuModule
  }
})
