import Vue from "vue";
import VueRouter from "vue-router";
import Vuex from "vuex";

import "@mdi/font/css/materialdesignicons.min.css";
import vuetify from "./plugins/vuetify.ts";

import App from "../views/App.vue";
import { createRouter } from "./router.ts";
import { createStore } from "./store.ts";
import { ApiClient } from "./api";
import { LocalCacheStore } from "./cache";

Vue.use(VueRouter);
Vue.use(Vuex);

const cacheStore = new LocalCacheStore();
const api = new ApiClient(cacheStore);
const router = createRouter();
const store = createStore(router, api);

Vue.prototype.$api = api;

new Vue({
    el: "#app",
    router,
    render: h => h(App),
    store,
    vuetify
});
