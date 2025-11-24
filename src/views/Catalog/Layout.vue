<script setup lang="ts">
import { readonly, ref } from "vue";
import Header from "./Header.vue";
import Brands from "./Brands.vue";
// import Footer from "./Footer.vue";
import Products from "./ProductList.vue";

const brand = ref<number | null>(null);
const readonlyBrand = readonly(brand);
</script>

<template>
  <div>
    <Header />
    <Brands v-model="brand" />
    <Products :selected-brand="readonlyBrand" />
    <!-- <Footer /> -->
  </div>
</template>

<style lang="css" scoped>
div {
  width: 100%;
  display: grid;
  row-gap: 10px;
  column-gap: 20px;
  grid-template:
    "header header  " auto
    "brands products" 1fr
    /* "footer footer  " auto */
    / 160px minmax(300px, 1fr);
  min-height: 100vh;
  margin: 0 auto 0;
}

@media (max-width: 720px) {
  div {
    display: flex;
    flex-direction: column;
  }
}
</style>
