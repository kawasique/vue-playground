<script setup lang="ts">
import {
  useProducts,
  type BrandedProduct,
  type Product,
} from "src/composables/product";
import ProductCard from "./ProductCard.vue";
import { useBrands } from "src/composables/brand";
import { computed } from "vue";

const props = defineProps<{
  selectedBrand: number | null;
}>();

const {
  isSuccess: isProductsSuccess,
  isPending: isProductsPending,
  isError: isProductsError,
  data: products,
  error: productsError,
} = useProducts(() => props.selectedBrand);

const {
  isSuccess: isBrandsSuccess,
  isPending: isBrandsPending,
  isError: isBrandsError,
  data: brands,
  error: brandsError,
} = useBrands();

const status = computed(() => ({
  isPending: isProductsPending.value || isBrandsPending.value,
  isSuccess: isProductsSuccess.value && isBrandsSuccess.value,
  isError: isProductsError.value || isBrandsError.value,
  error: productsError.value || brandsError.value,
}));

const brandsMap = computed(
  () => new Map(brands.value?.map((brand) => [brand.id, brand]))
);

function getBrandTitle(brandId: number) {
  return brandsMap.value.get(brandId)?.title || "<Unknown>";
}

function transformProduct(product: Product): BrandedProduct {
  return { ...product, brand: getBrandTitle(product.brand) };
}

const brandedProducts = computed<BrandedProduct[]>(
  () => products.value?.map(transformProduct) ?? []
);
</script>

<template>
  <main>
    <h2 class="title">Catalog</h2>
    <div v-if="status.isPending">Loading...</div>
    <div v-else-if="status.isError">
      Ошибка: {{ status.error?.message || "Не удалось загрузить данные" }}
    </div>
    <ul v-else-if="status.isSuccess" class="products">
      <ProductCard
        v-for="product in brandedProducts"
        :key="product.id"
        :product
      />
    </ul>
  </main>
</template>

<style lang="css" scoped>
.title {
  margin: 0;
  padding: 0;
  display: none;
}

.products {
  display: grid;
  margin-top: 0;
  padding: 0;
  grid-auto-flow: row;
  grid-gap: 10px;
  justify-content: space-between;
  grid-template-columns: repeat(2, minmax(150px, 220px));
}

main {
  grid-area: products;
}

@media (min-width: 320px) {
  .products {
    grid-template-columns: repeat(2, minmax(120px, 250px));
  }
}

@media (min-width: 550px) {
  .products {
    grid-template-columns: repeat(3, minmax(150px, 220px));
  }
}

@media (min-width: 720px) {
  .title {
    display: inline;
  }

  .products {
    margin-top: 16px;
    gap: 20px;
  }
}

@media (min-width: 900px) {
  .products {
    grid-template-columns: repeat(4, minmax(150px, 220px));
  }
}

@media (min-width: 1050px) {
  .products {
    grid-template-columns: repeat(5, minmax(150px, 220px));
  }
}
</style>
