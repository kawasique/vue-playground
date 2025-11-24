<script setup lang="ts">
import { useCartStore } from "src/stores/cart";

const cart = useCartStore();

function transformItems() {
  return cart.cartItems.map((i) => ({ id: i.id, count: i.quantity }));
}

function checkout() {
  console.log("*отправка заказа на бекенд*", JSON.stringify(transformItems()));
}
</script>

<template>
  <div class="layout">
    <header>
      <router-link to="/">
        <img alt="logo" src="/logo.svg" class="logo" />
      </router-link>
    </header>
    <main class="cart">
      <h2>Shopping Cart</h2>

      <div class="cart-header">
        <div class="item-col">Item</div>
        <div class="price-col">Price</div>
        <div class="qty-col">Qty</div>
        <div class="total-col">Total</div>
        <div class="remove-col"></div>
      </div>

      <div v-for="item in cart.cartItems" :key="item.id" class="cart-item">
        <div class="item-col">
          <img :src="item.image" :alt="item.title" class="item-image" />
          <div class="item-details">
            <div class="item-title">{{ item.brand }} / {{ item.title }}</div>
            <div v-if="item.options" class="item-options">
              <div v-for="[label, value] in Object.entries(item.options)">
                {{ label }}: {{ value }}
              </div>
            </div>
          </div>
        </div>

        <div class="price-col">${{ item.price.toFixed(2) }}</div>

        <div class="qty-col">
          <input
            type="number"
            class="qty-input"
            v-model.number="item.quantity"
            min="1"
            @input="item.quantity = Math.max(1, item.quantity)"
          />
        </div>

        <div class="total-col">
          ${{ (item.price * item.quantity).toFixed(2) }}
        </div>

        <div class="remove-col">
          <button @click="cart.removeItem(item.id)" class="remove-btn">
            <img src="/remove.svg" alt="remove" class="remove-icon" />
          </button>
        </div>
      </div>

      <div class="cart-footer">
        <div class="subtotal">Subtotal: ${{ cart.totalPrice.toFixed(2) }}</div>
        <button
          @click="checkout"
          class="checkout-btn"
          :disabled="cart.cartItems.length === 0"
        >
          Checkout
        </button>
      </div>
    </main>
  </div>
</template>

<style scoped>
.layout {
  max-width: 1400px;
}

header {
  display: flex;
  border-bottom: 2px solid #000;
  align-items: center;
  padding: 10px 0;
}

.logo {
  width: 160px;
  display: block;
}

.logo:hover {
  opacity: 60%;
  cursor: pointer;
}

.cart {
  margin: 10px auto;
  font-family: var(--font-family), Arial, sans-serif;
}

.cart h2 {
  margin: 0px;
  font-size: 24px;
}

.cart-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 40px;
  padding: 12px 0;
  border-bottom: 2px solid #000;
  font-weight: bold;
}

.cart-item {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 40px;
  padding: 16px 0;
  border-bottom: 2px solid #000;
  align-items: center;
}

.item-col {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border: 2px solid #000;
}

.item-details {
  font-size: 14px;
  line-height: 1.4;
}

.item-title {
  font-weight: 600;
  margin-bottom: 4px;
}

.item-options {
  font-size: 13px;
}

.price-col,
.qty-col,
.total-col {
  text-align: center;
  font-size: 16px;
}

.qty-input {
  width: 52px;
  padding: 6px 8px;
  text-align: center;
  border: 1px solid #000;
  border-radius: 4px;
  font-size: 14px;
}

.remove-col {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.remove-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin: 0;
}

.remove-icon {
  width: 25px;
  height: 25px;
  display: block;
}

.remove-btn:hover {
  opacity: 70%;
}

.cart-footer {
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.subtotal {
  font-size: 18px;
  font-weight: bold;
}

.checkout-btn {
  padding: 10px 24px;
  background: #000;
  color: white;
  border: 2px solid #000;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  font-family: inherit;
  transition: all 0.2s;
}

.checkout-btn:hover:not(:disabled) {
  opacity: 70%;
}

.checkout-btn:disabled {
  opacity: 50%;
  cursor: not-allowed;
}

@media (max-width: 720px) {
  .layout {
    padding: 0 16px;
  }

  .cart {
    margin: 10px 0;
  }

  .cart-header {
    display: none;
  }

  .cart-item {
    display: grid;
    grid-template-rows: auto auto;
    grid-template-columns: 1fr 1fr 1fr auto;
    gap: 12px;
    padding: 16px 0;
    border-bottom: 1px solid #ccc;
  }

  .item-col {
    grid-column: span 4;
    display: flex;
    align-items: flex-start;
    gap: 20px;
  }

  .item-image {
    width: 80px;
    height: 80px;
    object-fit: cover;
  }

  .item-details {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .item-title {
    font-size: 16px;
    line-height: 1.3;
  }

  .item-options {
    font-size: 13px;
    color: #555;
  }

  .price-col {
    grid-column: 1;
    align-self: center;
  }

  .qty-col {
    grid-column: 2;
    display: flex;
    justify-content: center;
  }

  .total-col {
    grid-column: 3;
    align-self: center;
    font-weight: bold;
  }

  .remove-col {
    grid-column: 4;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .price-col,
  .total-col {
    font-size: 16px;
  }

  .qty-input {
    width: 60px;
    padding: 6px;
    font-size: 14px;
  }

  .remove-btn {
    width: 36px;
    height: 36px;
  }

  .remove-icon {
    width: 22px;
    height: 22px;
  }

  .cart-footer {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .subtotal {
    font-size: 16px;
    text-align: left;
  }

  .checkout-btn {
    width: 100%;
    padding: 12px;
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .item-image {
    width: 70px;
    height: 70px;
  }

  .item-title {
    font-size: 15px;
  }

  .item-options {
    font-size: 12px;
  }

  .qty-input {
    width: 50px;
    font-size: 12px;
  }

  .remove-btn {
    width: 32px;
    height: 32px;
  }

  .remove-icon {
    width: 20px;
    height: 20px;
  }

  .checkout-btn {
    font-size: 14px;
  }
}
</style>
