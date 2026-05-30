export const CATEGORY_OPTIONS = [
  {
    name: "Scarves & Hijabs",
    legacyNames: ["Tudung"],
    subcategories: [
      { name: "Silk Chiffon", format: "Shawl", designs: ["Plain"] },
      { name: "Matte Satin Silk", format: "Shawl/Square", designs: ["Printed", "Plain"] },
      { name: "Cotton", format: "Square", designs: ["Printed"] },
      { name: "Korean Chiffon (Premium Quality)", format: "Shawl/Square", designs: [] },
    ],
  },
  {
    name: "Abayas and Dresses",
    legacyNames: ["Abaya"],
    subcategories: [
      { name: "Kids", designs: [] },
      { name: "Adults", designs: [] },
    ],
  },
  {
    name: "Arabian Perfumes, Bukhoor & Frankincense",
    legacyNames: ["Arabian Perfumes & Bukhoor & Frankincense"],
    subcategories: [],
  },
  {
    name: "Sunnah Products (Premium Quality)",
    subcategories: [
      { name: "Kurma", designs: [] },
      { name: "Olive Oil", designs: [] },
    ],
  },
];

export const getCanonicalCategoryName = (categoryName = "") => {
  const category = CATEGORY_OPTIONS.find(
    (option) => option.name === categoryName || option.legacyNames?.includes(categoryName)
  );

  return category?.name || categoryName;
};

export const categoryMatches = (product, category) =>
  product?.category === category.name || category.legacyNames?.includes(product?.category);

export const getProductCollectionLabel = (product) =>
  [getCanonicalCategoryName(product.category), product.subcategory, product.design]
    .filter(Boolean)
    .join(" / ");
