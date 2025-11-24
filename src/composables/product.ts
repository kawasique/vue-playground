import { useQuery } from "@tanstack/vue-query";
import { toValue, type MaybeRefOrGetter } from "vue";
import { API_BASE } from "./settings";

export type OptionKey = "color" | "size";

export type SimpleProduct = {
  type: "simple";
  id: number;
  sku: string;
  title: string;
  brand: number;
  image: string;
  regular_price: {
    currency: string;
    value: number;
  };
};

type ColorOption = {
  attribute_id: number;
  attribute_code: "color";
  label: string;
  values: {
    label: string;
    value_index: number;
    value: string;
  }[];
};

type SizeOption = {
  attribute_id: number;
  attribute_code: "size";
  label: string;
  values: {
    label: string;
    value_index: number;
    value: number;
  }[];
};

export type ConfigurableProduct = Omit<SimpleProduct, "type"> & {
  type: "configurable";
  configurable_options: (ColorOption | SizeOption)[];
  variants: {
    attributes: {
      code: OptionKey;
      value_index: number;
    }[];
    product: {
      id: number;
      sku: string;
      image: string;
    };
  }[];
};

export type Product = SimpleProduct | ConfigurableProduct;

type BrandReplacer<T> = Omit<T, "brand"> & {
  brand: string;
};

export type BrandedSimpleProduct = BrandReplacer<SimpleProduct>;
export type BrandedConfigurableProduct = BrandReplacer<ConfigurableProduct>;
export type BrandedProduct = BrandedSimpleProduct | BrandedConfigurableProduct;

function transformImageSrc(product: Product) {
  const apiBase = API_BASE.endsWith("/") ? API_BASE.slice(0, -1) : API_BASE;
  const result = {
    ...product,
    image: apiBase + product.image,
  };

  if (product.type === "configurable") {
    return {
      ...result,
      variants: product.variants.map((variant) => ({
        ...variant,
        product: {
          ...variant.product,
          image: apiBase + variant.product.image,
        },
      })),
    };
  }

  return result;
}

export async function getProducts(brand: number | null = null) {
  const response = await fetch(API_BASE + "level3/products.json");
  if (!response.ok)
    throw new Error(`Ошибка загрузки продуктов ${response.status}`);

  let data = (await response.json()) as Product[];
  data = data.map(transformImageSrc);

  if (brand) return data.filter((p) => p.brand === brand);
  return data;
}

export function useProducts(brand: MaybeRefOrGetter<number | null> = null) {
  return useQuery({
    // аналог естественного ключа в виде api/products?brand=...
    queryKey: ["/products", { brand }],
    queryFn: () => getProducts(toValue(brand)),
  });
}

export function formatProductPrice(product: Product | BrandedProduct) {
  const price = product.regular_price;
  if (price.currency === "USD") return `$${price.value}`;
  if (price.currency === "RUB") return `${price.value}₽`;
  return `${price.currency} ${price.value}`;
}
