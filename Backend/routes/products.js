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


// PUBLIC
router.get("/", getProducts);
router.get("/published", getPublishedProducts);
router.get("/:id", getProduct);


// ADMIN ONLY
router.post(
  "/",
  authMiddleware,
  upload.array("images", 10),
  createProduct
);

router.put(
  "/:id",
  authMiddleware,
  upload.array("images", 10),
  updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  deleteProduct
);

module.exports = router;
