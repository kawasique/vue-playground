import { VueQueryPlugin } from "@tanstack/vue-query";
import { createPinia } from "pinia";
import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import "./style.css";

import Catalog from "src/views/Catalog";
import Cart from "src/views/Cart.vue";
import { API_BASE } from "./composables/settings";

const app = createApp(App);
const pinia = createPinia();

const router = createRouter({
  history: createWebHistory(API_BASE),
  routes: [
    { path: "/", component: Catalog },
    { path: "/cart", component: Cart },
  ],
});

app.use(pinia);
app.use(router);
app.use(VueQueryPlugin, {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        staleTime: 5 * 1000,
      },
    },
  },
});

app.mount("#app");
