const getDesignCode = (variant) => String(variant?.designCode || variant?.sku || variant?.color || variant?.design || "").trim();
const getVariantLabel = (variant) => [getDesignCode(variant) ? `Design code: ${getDesignCode(variant)}` : "", variant?.size ? `Size: ${variant.size}` : "", variant?.type].filter(Boolean).join(" / ") || "Standard";
const normalizeVariants = (value, images = []) => {
  let variants = value || [];
  if (typeof variants === "string") {
    try { variants = JSON.parse(variants); } catch { throw new Error("Invalid design options."); }
  }
  if (!Array.isArray(variants)) throw new Error("Design options must be a list.");
  const combinations = new Set();
  return variants.map(variant => {
    const designCode = getDesignCode(variant);
    if (!designCode) throw new Error("Each option needs a design code, for example CS123.");
    const price = Number(variant.price), stock = Number(variant.stock);
    if (!Number.isFinite(price) || price <= 0 || !Number.isInteger(stock) || stock < 0) throw new Error("Each design needs a positive price and a whole stock quantity of zero or more.");
    const size = String(variant.size || "").trim();
    const key = JSON.stringify([designCode.toLowerCase(), size.toLowerCase()]);
    if (combinations.has(key)) throw new Error("Duplicate design code / size options are not allowed.");
    combinations.add(key);
    const hasIndex = variant.imageIndex !== undefined && variant.imageIndex !== "";
    const index = Number(variant.imageIndex);
    const image = hasIndex ? Number.isInteger(index) && index >= 0 ? images[index] : "" : images.includes(variant.image) ? variant.image : "";
    if (!image) throw new Error(`Choose a matching product photo for design ${designCode}.`);
    return { ...(variant._id ? { _id: variant._id } : {}), designCode, size,
      type: String(variant.type || "").trim(), design: String(variant.design || "").trim(),
      price, stock, sku: String(variant.sku || "").trim(), image };
  });
};
module.exports = { getDesignCode, getVariantLabel, normalizeVariants };
