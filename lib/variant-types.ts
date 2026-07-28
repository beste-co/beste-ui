export interface VariantOption {
  value: string;
  label: string;
}

export interface VariantFieldConfig {
  label: string;
  type: "select" | "boolean" | "number" | "info";
  options?: VariantOption[];
  default?: string | boolean | number;
  /** Message to display for info type */
  message?: string;
}

export type VariantConfig = Record<string, VariantFieldConfig>;
