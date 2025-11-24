<script setup lang="ts">
import {
  formatProductPrice,
  type BrandedProduct,
} from "src/composables/product";

import { computed, reactive, watch } from "vue";
import useCartInteraction from "./composables/useCartInteraction";
import useConfigurableProduct from "./composables/useConfigurableProduct";

const props = defineProps<{ product: BrandedProduct }>();

const {
  options,
  selectedVariant,
  handleOptionSelection,
  isOptionDisabled,
  isOptionSelected,
} = useConfigurableProduct(props.product);

const image = reactive({
  src: props.product.image,
  isLoading: false,
});

watch(
  () => selectedVariant.value?.image,
  async function (newImage: string | undefined) {
    if (!newImage) {
      image.src = props.product.image;
      return;
    }

    image.isLoading = true;

    const img = new Image();
    img.src = newImage;

    try {
      await img.decode();
      image.src = newImage;
    } catch (e) {
      img.src = props.product.image;
    }
    image.isLoading = false;
  },
  { immediate: true }
);

const { addToCart, canAdd, isAdded } = useCartInteraction(
  props.product,
  selectedVariant
);
</script>

<template>
  <div class="card">
    <div>
      <img
        v-if="image.isLoading"
        class="image"
        src="src/assets/productLoading.svg"
      />
      <img v-else class="image" :src="image.src" />
      <div class="name">{{ props.product.title }}</div>
      <div class="brand">{{ props.product.brand }}</div>
      <div class="price">{{ formatProductPrice(props.product) }}</div>
      <div v-if="options" class="params">
        <div
          v-for="[attr, attrOptions] in Object.entries(options)"
          :key="attr"
          class="attribute"
          :data-attr="attr"
        >
          <button
            v-for="value in attrOptions"
            :key="value.value_index"
            :class="[
              'option',
              { active: isOptionSelected(attr, value.value_index) },
            ]"
            :style="{ '--option-value': value.value }"
            :disabled="isOptionDisabled(attr, value.value_index)"
            @click="handleOptionSelection(attr, value.value_index)"
          >
            <span v-if="attr === 'size'">{{ value.label }}</span>
            <span v-if="attr === 'suit'">{{ value.value }}</span>
          </button>
        </div>
      </div>
    </div>
    <button
      :class="['add-button', { isAdded }]"
      :disabled="!canAdd"
      @click="addToCart"
    >
      {{ isAdded ? "Open in cart" : "Add to cart" }}
    </button>
  </div>
</template>

<style lang="css" scoped>
.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: left;
}

.add-button {
  margin-top: 10px;
  display: block;
  color: #fff;
  background-color: #000;
  border: 2px solid #000;
  padding: 10px;
  width: 100%;
  font-family: inherit;
  font-size: inherit;
  cursor: pointer;
}

.add-button.isAdded {
  background-color: #fff;
  color: #000;
}

.add-button:not(:disabled):hover {
  opacity: 70%;
}

.add-button:disabled {
  cursor: not-allowed;
  opacity: 30%;
}

.image {
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #000;
  box-sizing: border-box;
}

.name {
  font-weight: bold;
  margin-top: 10px;
  font-size: 16px;
  color: #000;
}

.brand,
.price {
  color: #000;
  margin-top: 5px;
  font-size: 14px;
}

.params {
  display: flex;
  flex-direction: column;
}

.attribute {
  margin-top: 5px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.option:hover {
  opacity: 60%;
}

.option:disabled {
  opacity: 50%;
  cursor: not-allowed;
}

.option.active {
  border-color: #f39c12;
}

.option {
  width: 32px;
  height: 24px;
  border: 2px solid black;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  text-align: center;
  background-color: var(--option-value, #fff);
}
</style>
