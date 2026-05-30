const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  type: {
    type: String,
  },

  design: {
    type: String,
  },

  color: {
    type: String,
  },

  size: {
    type: String,
  },

  price: {
    type: Number,
    required: true,
  },

  stock: {
    type: Number,
    default: 0,
  },

  sku: {
    type: String,
  },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    category: {
      type: String,
      required: true,
    },

    subcategory: {
      type: String,
    },

    design: {
      type: String,
    },

    basePrice: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      default: 0,
    },

    image: {
      type: String,
    },

    showcaseImage: {
      type: String,
    },

    images: [
      {
        type: String,
      },
    ],

    variants: [variantSchema],

    tags: [String],

    isPublished: {
      type: Boolean,
      default: false,
    },

    isShowcased: {
      type: Boolean,
      default: false,
    },

    showcaseTitle: {
      type: String,
      default: "",
    },

    showcaseSubtitle: {
      type: String,
      default: "",
    },

    showcaseOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
