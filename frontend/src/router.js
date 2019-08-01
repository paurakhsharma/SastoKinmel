import Vue from "vue";
import Router from "vue-router";
import Search from "./views/Search.vue";
import Home from "./views/Home.vue";
import Predict from "./views/Predict.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "search",
      component: Search
    },
    {
      path: "/all",
      name: "all",
      component: Home
    },
    {
      path: "/predict",
      name: "predict",
      component: Predict
    }
  ]
});
