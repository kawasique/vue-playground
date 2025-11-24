import { useQuery } from "@tanstack/vue-query";
import { computed, toValue, type MaybeRefOrGetter } from "vue";

export type Brand = {
  id: number;
  title: string;
  sort: string;
  code: string;
};

export async function getBrands() {
  const response = await fetch("/level1/brands.json");
  if (!response.ok)
    throw new Error(`Ошибка загрузки брендов ${response.status}`);

  const data = await response.json();
  return data as Brand[];
}

export async function getBrand(id: number) {
  const brands = await getBrands();
  const brand = brands.find((b) => b.id === id);

  return brand ? brand : "<unknown brand>";
}

export function useBrands() {
  return useQuery({
    queryKey: ["/brands"],
    queryFn: getBrands,
  });
}

export function useBrand(brand: MaybeRefOrGetter<number>) {
  return useQuery({
    queryKey: ["/brands", brand],
    queryFn: () => getBrand(toValue(brand)),
  });
}
