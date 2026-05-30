const Product = require("../models/Product");

const parseVariants = (variants) => {
  if (!variants) return [];

  if (Array.isArray(variants)) return variants;

  try {
    const parsed = JSON.parse(variants);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const normalizeVariants = (variants) =>
  parseVariants(variants)
    .filter((variant) => Number(variant.price) > 0)
    .map((variant) => ({
      type: variant.type || "",
      design: variant.design || "",
      color: variant.color || "",
      size: variant.size || "",
      price: Number(variant.price) || 0,
      stock: Number(variant.stock) || 0,
      sku: variant.sku || "",
    }));

const normalizeCategory = (category = "") => {
  const categoryMap = {
    Tudung: "Scarves & Hijabs",
    Abaya: "Abayas and Dresses",
    "Arabian Perfumes & Bukhoor & Frankincense": "Arabian Perfumes, Bukhoor & Frankincense",
  };

  return categoryMap[category] || category;
};

const toBoolean = (value) => value === true || value === "true" || value === "on";

const getUploadedImagePaths = (req) => {
  const getFileUrl = (file) => file.path || (file.filename ? `/uploads/${file.filename}` : "");

  if (Array.isArray(req.files) && req.files.length > 0) {
    return req.files.map(getFileUrl).filter(Boolean);
  }

  if (req.file) {
    return [getFileUrl(req.file)].filter(Boolean);
  }

  return [];
};

// CREATE PRODUCT
const createProduct = async (
  req,
  res
) => {
  try {

    const {
      name,
      description,
      category,
      subcategory,
      design,
      basePrice,
      price,
      variants,
      isShowcased,
      showcaseTitle,
      showcaseSubtitle,
      showcaseOrder,
      showcaseImageIndex,
    } = req.body;

    const normalizedBasePrice = Number(basePrice ?? price) || 0;
    const uploadedImages = getUploadedImagePaths(req);
    const selectedShowcaseIndex = Math.max(0, Number(showcaseImageIndex) || 0);
    const primaryImage = uploadedImages[selectedShowcaseIndex] || uploadedImages[0] || "";

    const product =
      new Product({

        name,
        description,
        category: normalizeCategory(category),
        subcategory,
        design,
        basePrice: normalizedBasePrice,
        price: normalizedBasePrice,
        variants: normalizeVariants(variants),
        isShowcased: toBoolean(isShowcased),
        showcaseTitle: showcaseTitle || "",
        showcaseSubtitle: showcaseSubtitle || "",
        showcaseOrder: Number(showcaseOrder) || 0,
        showcaseImage: primaryImage,

        image: primaryImage,
        images: uploadedImages,

      });

    const savedProduct =
      await product.save();

    res.status(201).json(
      savedProduct
    );

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


// GET ALL PRODUCTS
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET PUBLISHED PRODUCTS
const getPublishedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isPublished: true,
    }).sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// GET SINGLE PRODUCT
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
    };

    if (
      Object.prototype.hasOwnProperty.call(updateData, "basePrice") ||
      Object.prototype.hasOwnProperty.call(updateData, "price")
    ) {
      const normalizedBasePrice = Number(updateData.basePrice ?? updateData.price) || 0;
      updateData.basePrice = normalizedBasePrice;
      updateData.price = normalizedBasePrice;
    }

    if (Object.prototype.hasOwnProperty.call(updateData, "variants")) {
      updateData.variants = normalizeVariants(updateData.variants);
    }

    if (Object.prototype.hasOwnProperty.call(updateData, "category")) {
      updateData.category = normalizeCategory(updateData.category);
    }

    if (Object.prototype.hasOwnProperty.call(updateData, "isShowcased")) {
      updateData.isShowcased = toBoolean(updateData.isShowcased);
    }

    if (Object.prototype.hasOwnProperty.call(updateData, "showcaseOrder")) {
      updateData.showcaseOrder = Number(updateData.showcaseOrder) || 0;
    }

    const uploadedImages = getUploadedImagePaths(req);

    if (uploadedImages.length > 0) {
      const selectedShowcaseIndex = Math.max(0, Number(updateData.showcaseImageIndex) || 0);
      const primaryImage = uploadedImages[selectedShowcaseIndex] || uploadedImages[0];
      updateData.image = primaryImage;
      updateData.showcaseImage = primaryImage;
      updateData.images = uploadedImages;
      delete updateData.showcaseImageIndex;
    } else if (Object.prototype.hasOwnProperty.call(updateData, "showcaseImage")) {
      updateData.image = updateData.showcaseImage;
    }

    const updatedProduct =
      await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
        }
      );

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getPublishedProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
