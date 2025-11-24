import { defineStore } from "pinia";

type Attr = string;
type Label = string;

export type CartItem = {
  id: number;
  title: string;
  image: string;
  brand: string;
  quantity: number;
  price: number;
  options?: Record<Attr, Label>;
};

export type AddItem = Omit<CartItem, "quantity">;

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: new Map<number, CartItem>(),
  }),

  getters: {
    cartItems(state): CartItem[] {
      return Array.from(state.items.values());
    },

    totalItems(): number {
      return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    },

    totalPrice(): number {
      return this.cartItems.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      );
    },
  },

  actions: {
    hasItem(id: number) {
      return this.items.has(id);
    },

    addItem(item: Omit<CartItem, "quantity">) {
      const existingItem = this.items.get(item.id);
      if (!existingItem) {
        this.items.set(item.id, { ...item, quantity: 1 });
      } else {
        existingItem.quantity += 1;
      }
    },

    removeItem(id: number) {
      this.items.delete(id);
    },

    setQuantity(id: number, quantity: number) {
      if (quantity < 1) this.items.delete(id);

      const item = this.items.get(id);
      if (item) item.quantity = quantity;
    },

    clear() {
      this.items.clear();
    },
  },
});
