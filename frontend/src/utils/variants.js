// Keep existing options readable until their product is saved with explicit design codes.
export const getDesignCode = (variant) => String(variant?.designCode || variant?.sku || variant?.color || variant?.design || "").trim();
export const getVariantLabel = (variant) => [
  getDesignCode(variant) ? `Design code: ${getDesignCode(variant)}` : "",
  variant?.size ? `Size: ${variant.size}` : "",
  variant?.type,
].filter(Boolean).join(" / ") || "Standard";
