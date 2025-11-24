import { computed, reactive, ref, type Ref } from "vue";

type AttributeCode = string;
type ValueIndex = number;
type Value = any;

type OptionValue = {
  value_index: ValueIndex;
  label: string;
  value: Value;
};

type ConfigurableOption = {
  attribute_id: number;
  attribute_code: AttributeCode;
  label: string;
  values: OptionValue[];
};

type VariantProduct = {
  id: number;
  sku: string;
  image: string;
};

type Variant = {
  attributes: {
    code: AttributeCode;
    value_index: ValueIndex;
  }[];
  product: VariantProduct;
};

type SimpleProduct = {
  type: "simple";
};

type ConfigurableProduct = {
  id: number;
  type: "configurable";
  sku: string;
  title: string;
  brand: string;
  image: string;
  regular_price: {
    currency: string;
    value: number;
  };
  configurable_options: ConfigurableOption[];
  variants: Variant[];
};

type Product = SimpleProduct | ConfigurableProduct;

type Attributes = Record<AttributeCode, string>;
type Options = Record<AttributeCode, Record<ValueIndex, OptionValue>>;
type OptionPairs = Record<
  AttributeCode,
  Record<ValueIndex, Record<AttributeCode, Set<ValueIndex>>>
>;
type SelectedOptions = Record<AttributeCode, ValueIndex>;
type SelectedVariantOptions = Record<AttributeCode, OptionValue>;
type SelectedVariant = VariantProduct & { options: SelectedVariantOptions };

type ReturnType = {
  attributes: Ref<Attributes>;
  options: Ref<Options>;
  optionPairs: Ref<OptionPairs>;
  selectedVariant: Ref<null | SelectedVariant>;
  //
  isOptionSelected: (code: AttributeCode, id: ValueIndex) => boolean;
  isOptionDisabled: (code: AttributeCode, id: ValueIndex) => boolean;
  handleOptionSelection: (code: AttributeCode, id: ValueIndex) => void;
};

export default function useConfigurableProduct(product: Product): ReturnType {
  if (product.type === "simple")
    return {
      attributes: ref({}),
      options: ref({}),
      optionPairs: ref({}),
      selectedVariant: ref(null),
      //
      isOptionSelected: () => false,
      isOptionDisabled: () => false,
      handleOptionSelection: () => {},
    };

  const selectedOptions = reactive<SelectedOptions>({});

  const variants = computed(() => product.variants);

  const attributes = computed(function () {
    const result: Attributes = {};

    product.configurable_options.forEach(function (option) {
      result[option.attribute_code] = option.label;
    });

    return result;
  });

  const options = computed(function () {
    const result: Options = {};
    product.configurable_options.forEach(function (option) {
      const valuesMap: Record<ValueIndex, OptionValue> = {};

      option.values.forEach(function (val) {
        valuesMap[val.value_index] = val;
      });

      result[option.attribute_code] = valuesMap;
    });

    return result;
  });

  const optionPairs = computed(function () {
    const pairs: OptionPairs = {};

    // инициализация пустых
    for (const [code, values] of Object.entries(options.value)) {
      pairs[code] = {};

      for (const value of Object.values(values)) {
        const id = value.value_index;

        if (!pairs[code][id]) pairs[code][id] = {};

        for (const otherAttrCode of Object.keys(options.value)) {
          if (otherAttrCode !== code) {
            pairs[code][id][otherAttrCode] = new Set<ValueIndex>();
          }
        }
      }
    }

    // заполнение вариантами
    for (const variant of product.variants) {
      for (const attr of variant.attributes) {
        const currentCode = attr.code;
        const currentId = attr.value_index;

        if (!pairs[currentCode]?.[currentId]) continue;

        for (const otherAttr of variant.attributes) {
          if (otherAttr.code === currentCode) continue;

          const otherAttrCode = otherAttr.code;
          const otherValueIndex = otherAttr.value_index;

          const compatSet = pairs[currentCode][currentId][otherAttrCode];
          if (compatSet !== undefined) {
            compatSet.add(otherValueIndex);
          }
        }
      }
    }

    return pairs;
  });

  const selectedVariant = computed(function () {
    const attrs = Object.keys(attributes.value);

    if (Object.keys(selectedOptions).length !== attrs.length) {
      return null;
    }

    const matchedVariant = product.variants.find((variant) => {
      return attrs.every((code) => {
        const selectedValue = selectedOptions[code];
        const variantAttr = variant.attributes.find((a) => a.code === code);
        return variantAttr && variantAttr.value_index === selectedValue;
      });
    });

    if (!matchedVariant) return null;

    const selectedOptionsData: SelectedVariantOptions = {};
    for (const [code, valueIndex] of Object.entries(selectedOptions)) {
      const optionValue = options.value[code]?.[valueIndex];
      if (optionValue) {
        selectedOptionsData[code] = optionValue;
      }
    }

    return { ...matchedVariant.product, options: selectedOptionsData };
  });

  function isVariantExist(code: AttributeCode, id: ValueIndex) {
    return variants.value.some((v) =>
      v.attributes.some((a) => a.code === code && a.value_index === id)
    );
  }

  function isOptionSelected(code: AttributeCode, id: ValueIndex) {
    return selectedOptions[code] === id;
  }

  function isOptionDisabled(code: AttributeCode, id: ValueIndex) {
    if (isOptionSelected(code, id)) return false;

    // ничего не выбрано -> опция доступна, если есть хотя бы один вариант с ней
    if (Object.keys(selectedOptions).length === 0)
      return !isVariantExist(code, id);

    // опции есть -> проверка на совместимость с другими опциями
    for (const [selectedCode, selectedId] of Object.entries(selectedOptions)) {
      const compatSet = optionPairs.value[selectedCode]?.[selectedId]?.[code];

      if (!compatSet?.has(id)) return true;
    }

    return false;
  }

  const handleOptionSelection = (code: AttributeCode, id: ValueIndex) => {
    if (selectedOptions[code] === id) {
      delete selectedOptions[code];
    } else {
      if (!isOptionDisabled(code, id)) selectedOptions[code] = id;
    }
  };

  return {
    attributes: attributes,
    options: options,
    optionPairs: optionPairs,
    selectedVariant: selectedVariant,
    //
    isOptionSelected,
    isOptionDisabled,
    handleOptionSelection,
  };
}
