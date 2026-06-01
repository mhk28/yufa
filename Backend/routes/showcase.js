const express = require("express");
const ShowcaseSlide = require("../models/ShowcaseSlide");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/auth");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

const isAdmin = (req) => req.user?.role === "admin";
const getMediaType = (file = {}) => (file.mimetype?.startsWith("video/") ? "video" : "image");
const getFileUrl = (file) => file.path || (file.filename ? `/uploads/${file.filename}` : "");
const getProductImages = (product) =>
  [...new Set([product.showcaseImage, product.image, ...(product.images || [])].filter(Boolean))];
const mapProductToSlide = (product) => ({
  _id: `product-${product._id}`,
  sourceType: "product",
  productId: product._id,
  title: product.showcaseTitle || product.name,
  subtitle: product.showcaseSubtitle || product.description || "",
  mediaUrl: product.showcaseImage || product.image,
  mediaType: "image",
  images: getProductImages(product),
  order: product.showcaseOrder || 0,
  isActive: product.isPublished && product.isShowcased,
  product,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
});

const mapCustomSlide = (slide) => ({
  ...slide.toObject(),
  sourceType: "custom",
});

const sortSlides = (slides) =>
  slides.sort((a, b) => {
    if ((a.order || 0) !== (b.order || 0)) return (a.order || 0) - (b.order || 0);
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

router.get("/", async (req, res) => {
  try {
    const [customSlides, products] = await Promise.all([
      ShowcaseSlide.find({ isActive: true }),
      Product.find({
        isPublished: true,
        isShowcased: true,
        $or: [
          { showcaseImage: { $exists: true, $nin: ["", null] } },
          { image: { $exists: true, $nin: ["", null] } },
        ],
      }),
    ]);

    res.json(sortSlides([...customSlides.map(mapCustomSlide), ...products.map(mapProductToSlide)]));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/admin", authMiddleware, async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Admin access required." });
    }

    const [customSlides, products] = await Promise.all([
      ShowcaseSlide.find(),
      Product.find({ isShowcased: true }),
    ]);

    res.json(sortSlides([...customSlides.map(mapCustomSlide), ...products.map(mapProductToSlide)]));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/product/:productId", authMiddleware, async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Admin access required." });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      {
        isShowcased: req.body.isShowcased !== false && req.body.isShowcased !== "false",
        showcaseTitle: req.body.title || "",
        showcaseSubtitle: req.body.subtitle || "",
        showcaseOrder: Number(req.body.order) || 0,
        ...(req.body.showcaseImage ? { showcaseImage: req.body.showcaseImage } : {}),
      },
      { new: true }
    );

    res.json(mapProductToSlide(product));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/product/:productId", authMiddleware, async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Admin access required." });
    }

    await Product.findByIdAndUpdate(req.params.productId, {
      isShowcased: false,
      showcaseTitle: "",
      showcaseSubtitle: "",
      showcaseOrder: 0,
    });

    res.json({ message: "Product removed from showcase." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", authMiddleware, upload.single("media"), async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Admin access required." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Showcase media is required." });
    }

    const slide = await ShowcaseSlide.create({
      title: req.body.title || "",
      subtitle: req.body.subtitle || "",
      mediaUrl: getFileUrl(req.file),
      mediaType: getMediaType(req.file),
      order: Number(req.body.order) || 0,
      isActive: req.body.isActive !== "false",
    });

    res.status(201).json(slide);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", authMiddleware, upload.single("media"), async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Admin access required." });
    }

    const updateData = {
      title: req.body.title || "",
      subtitle: req.body.subtitle || "",
      order: Number(req.body.order) || 0,
      isActive: req.body.isActive !== "false",
    };

    if (req.file) {
      updateData.mediaUrl = getFileUrl(req.file);
      updateData.mediaType = getMediaType(req.file);
    }

    const slide = await ShowcaseSlide.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(slide);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Admin access required." });
    }

    await ShowcaseSlide.findByIdAndDelete(req.params.id);
    res.json({ message: "Showcase slide deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
