<script setup lang="ts">
import { useCartStore } from "src/stores/cart";

const cart = useCartStore();
</script>

<template>
  <header>
    <router-link to="/">
      <img class="logo" alt="logo" src="/logo.svg" />
    </router-link>
    <router-link to="/cart" class="cart">
      <img alt="cart" src="/cart.svg" />
      <span v-if="cart.totalItems > 0" class="cart-badge">{{
        cart.totalItems
      }}</span>
    </router-link>
  </header>
</template>

<style lang="css" scoped>
header {
  display: flex;
  grid-area: header;
  border-bottom: 2px solid #000;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.logo {
  width: 160px;
  height: auto;
  display: block;
}

.logo:hover {
  opacity: 60%;
  cursor: pointer;
}

.cart {
  display: flex;
  position: relative;
  background: none;
  border: none;
  padding: 8px 5px 2px;
  cursor: pointer;
  max-height: 100%;
  font-family: inherit;
}

.cart > img {
  height: 40px;
  width: auto;
}

.cart:hover {
  opacity: 60%;
}

.cart-badge {
  position: absolute;
  top: 0px;
  right: -2px;
  background-color: white;
  color: black;
  border: 2px solid black;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: bold;
  line-height: 1;
  pointer-events: none;
}
</style>
