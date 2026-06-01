const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    productId: String,
    name: String,
    image: String,
    variantKey: String,
    variantLabel: String,
    price: {
      type: Number,
      default: 0,
    },
    quantity: {
      type: Number,
      default: 1,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    customerInfo: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      address: String,
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      default: 0,
    },
    shipping: {
      type: Number,
      default: 0,
    },
    shippingMethod: {
      type: String,
      default: "local_delivery",
    },
    paymentMethod: {
      type: String,
      default: "pending",
    },
    paymentStatus: {
      type: String,
      default: "pending",
    },
    stripeSessionId: String,
    stripePaymentIntentId: String,
    paidAt: Date,
    orderStatus: {
      type: String,
      default: "received",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
