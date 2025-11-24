// composables/useCartInteraction.ts
import type { BrandedProduct } from "src/composables/product";
import { computed } from "vue";
import { useCartStore, type AddItem } from "src/stores/cart";
import type useConfigurableProduct from "./useConfigurableProduct";
import { useRouter } from "vue-router";

type SelectedVariant = ReturnType<
  typeof useConfigurableProduct
>["selectedVariant"];

export default function useCartInteraction(
  product: BrandedProduct,
  selectedVariant: SelectedVariant
) {
  const cart = useCartStore();
  const router = useRouter();

  const canAdd = computed(() =>
    product.type === "simple" ? true : !!selectedVariant.value
  );

  const isAdded = computed(() => {
    if (!canAdd.value) return false;
    if (product.type === "simple") return cart.hasItem(product.id);
    if (selectedVariant.value) cart.hasItem(selectedVariant.value.id);
    return false;
  });

  function addToCart() {
    if (isAdded.value) {
      router.push("/cart");
      return;
    }

    const item: AddItem = selectedVariant.value
      ? {
          id: selectedVariant.value.id,
          title: product.title,
          image: selectedVariant.value.image,
          price: product.regular_price.value,
          brand: product.brand,
          options: Object.fromEntries(
            Object.entries(selectedVariant.value.options).map(([attr, opt]) => [
              attr,
              opt.label,
            ])
          ),
        }
      : {
          id: product.id,
          title: product.title,
          image: product.image,
          brand: product.brand,
          price: product.regular_price.value,
        };

    cart.addItem(item);
  }

  return { canAdd, isAdded, addToCart };
}
