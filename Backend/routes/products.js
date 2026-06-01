const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth");

const upload = require("../middleware/uploadMiddleware");

const {
  createProduct,
  getProducts,
  getPublishedProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const uploadProductImages = (req, res, next) => {
  upload.array("images", 10)(req, res, (error) => {
    if (!error) {
      next();
      return;
    }

    console.log("Product image upload failed:", error.message);

    res.status(400).json({
      message: error.message || "Image upload failed. Please try a different image file.",
    });
  });
};


// PUBLIC
router.get("/", getProducts);
router.get("/published", getPublishedProducts);
router.get("/:id", getProduct);


// ADMIN ONLY
router.post(
  "/",
  authMiddleware,
  uploadProductImages,
  createProduct
);

router.put(
  "/:id",
  authMiddleware,
  uploadProductImages,
  updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  deleteProduct
);

module.exports = router;
