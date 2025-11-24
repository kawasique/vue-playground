<script setup lang="ts">
import { useBrands } from "src/composables/brand";

const brandId = defineModel<number | null>();
function setBrand(id: number | null) {
  brandId.value = id;
}

const { isSuccess, isPending, isError, data, error } = useBrands();
</script>

<template>
  <nav>
    <div v-if="isPending">Loading...</div>
    <div v-else-if="isError">
      Ошибка: {{ error?.message || "Не удалось загрузить бренды" }}
    </div>
    <div v-else-if="isSuccess && data">
      <select class="mobile-selector" v-model="brandId">
        <option :value="null">All brands</option>
        <option v-for="brand in data" :key="brand.id" :value="brand.id">
          {{ brand.title }}
        </option>
      </select>

      <ul class="desktop-selector">
        <li>
          <button
            type="button"
            @click="setBrand(null)"
            :class="{ active: brandId === null }"
          >
            All Brands
          </button>
        </li>
        <li v-for="brand in data" :key="brand.id">
          <button
            type="button"
            @click="setBrand(brand.id)"
            :class="{ active: brandId === brand.id }"
          >
            {{ brand.title }}
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style lang="css" scoped>
nav {
  grid-area: brands;
  height: fit-content;
}

.desktop-selector {
  display: none;
  list-style: none;
  padding: 0;
  margin: 0;
}

button {
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  padding: 6px 0;
  width: 100%;
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  text-decoration: none;
  transition: text-decoration 0.2s ease;
}

button:hover {
  text-decoration: underline;
}

button.active {
  text-decoration: underline;
  font-weight: normal;
}

.mobile-selector {
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  font-family: inherit;
  color: #000;
  background-color: #fff;
  border: 2px solid #000;
  border-radius: 0;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
  outline: none;
  box-sizing: border-box;
}

.mobile-selector {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 12px 12px;
  padding-right: 36px;
}

.mobile-selector option {
  color: #000;
  background-color: #fff;
  font-size: 16px;
  padding: 8px 12px;
}

@media (min-width: 720px) {
  nav {
    border-right: 2px solid black;
  }

  .mobile-selector {
    display: none;
  }

  .desktop-selector {
    display: block;
  }
}
</style>
