const { getDesignCode, getVariantLabel } = require("./designVariants");
const Product = require("../models/Product");

module.exports = async function resolveCheckoutItems(items) {
  if (!Array.isArray(items) || !items.length) throw new Error("Checkout requires at least one item.");
  const result = [];
  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product?.isPublished) throw new Error("A product is no longer available.");
    const variant = product.variants.length ? product.variants.id(item.variantKey) : null;
    if (product.variants.length && !variant) throw new Error("Please select an available design code / size again.");
    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity < 1) throw new Error("Invalid item quantity.");
    const previous = result.find(row => row.productId === String(product._id) && row.variantKey === (variant ? String(variant._id) : ""));
    if (variant && quantity + (previous?.quantity || 0) > variant.stock) throw new Error("Not enough stock for the selected design code / size.");
    const price = variant ? variant.price : product.isOnSale && product.salePrice > 0 ? product.salePrice : product.basePrice || product.price;
    if (!Number.isFinite(price) || price <= 0) throw new Error("Product price is unavailable.");
    if (previous) { previous.quantity += quantity; continue; }
    result.push({ productId: String(product._id), product: product._id, name: product.name,
      variantKey: variant ? String(variant._id) : "", designCode: variant ? getDesignCode(variant) : "", size: variant?.size || "",
      variantLabel: variant ? getVariantLabel(variant) : "Standard",
      image: variant?.image || product.image, price, quantity });
  }
  return { items: result, subtotal: result.reduce((sum, item) => sum + Math.round(item.price * 100) * item.quantity, 0) / 100 };
};
