import type { BrandedProduct } from "src/composables/product";
import { computed } from "vue";

type Color = string;
type Size = string;

export function useProductOptions(product: BrandedProduct) {
  return computed(() => {
    if (product.type !== "configurable") return undefined;

    const idToValue = {
      color: new Map<number, Color>(),
      size: new Map<number, Size>(),
    };

    const result = {
      color: new Map<Color, Size[]>(),
      size: new Map<Size, Color[]>(),
    };

    for (const option of product.configurable_options) {
      const code = option.attribute_code as "color" | "size";
      for (const value of option.values) {
        const key = (code === "color" ? value.value : value.label) as string;
        const id = value.value_index;

        result[code].set(key, []);
        idToValue[code].set(id, key);
      }
    }

    for (const variant of product.variants) {
      let color: Color | undefined;
      let size: Size | undefined;

      for (const attr of variant.attributes) {
        const value = idToValue[attr.code as "color" | "size"].get(
          attr.value_index
        );
        if (attr.code === "color") color = value;
        else if (attr.code === "size") size = value;
      }

      if (!size || !color) {
        console.error(`Вариант продукта ${variant} не имеет цвета или размера`);
        continue;
      }

      result.color.get(color)?.push(size);
      result.size.get(size)?.push(color);
    }

    return result;
  });
}
