import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    products: []
  },
  mutations: {
    load_products(state, products) {
      state.products = products;
    }
  },
  actions: {
    load_products({ commit }, products) {
      commit("load_products", products);
    }
  }
});
