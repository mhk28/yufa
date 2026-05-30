export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
  }).format(Number(amount) || 0);

export const getProductPrice = (product) => {
  const variantPrices = product?.variants
    ?.map((variant) => Number(variant.price))
    .filter((price) => Number.isFinite(price) && price > 0);

  if (variantPrices?.length) {
    return Math.min(...variantPrices);
  }

  return Number(product?.basePrice ?? product?.price) || 0;
};

export const getProductPriceLabel = (product) => {
  const hasVariantPricing = product?.variants?.some((variant) => Number(variant.price) > 0);
  const price = getProductPrice(product);

  if (!price) return "Price on request";

  return `${hasVariantPricing ? "From " : ""}${formatCurrency(price)}`;
};

export const categoryToSlug = (category = "") =>
  category
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\btudung\b/g, "scarves-and-hijabs")
    .replace(/\babaya\b/g, "abayas-and-dresses")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const getImageUrl = (image) => {
  if (!image) return "";
  if (image.startsWith("http")) return image;
  return `${API_BASE_URL}${image}`;
};

export const fetchPublishedProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/products/published`);
  if (!response.ok) throw new Error("Failed to load published products.");
  return response.json();
};

export const fetchShowcaseSlides = async () => {
  const response = await fetch(`${API_BASE_URL}/showcase`);
  if (!response.ok) throw new Error("Failed to load showcase slides.");
  return response.json();
};
