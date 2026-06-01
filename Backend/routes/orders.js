const express = require("express");
const Order = require("../models/Order");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");
const { sendOrderEmails } = require("../utils/emailService");

const router = express.Router();
const LOCAL_DELIVERY_FEE = 5;
const FREE_DELIVERY_THRESHOLD = 100;

const isAdmin = (req) => req.user?.role === "admin";
const getShippingFee = (shippingMethod, subtotal) => {
  if (shippingMethod === "pickup") return 0;
  return Number(subtotal) >= FREE_DELIVERY_THRESHOLD ? 0 : LOCAL_DELIVERY_FEE;
};

const notifyOrderCreated = async (order) => {
  try {
    const admins = await User.find({ role: "admin" }).select("email");
    await sendOrderEmails({
      order,
      adminEmails: admins.map((admin) => admin.email),
    });
  } catch (error) {
    console.log("Order email notification skipped:", error.message);
  }
};

router.post("/", async (req, res) => {
  try {
    const { customerInfo, items, subtotal, shippingMethod = "local_delivery", paymentMethod } = req.body;

    if (!items?.length) {
      return res.status(400).json({ message: "Order requires at least one item." });
    }

    const order = new Order({
      customerInfo,
      items,
      subtotal: Number(subtotal) || 0,
      shipping: getShippingFee(shippingMethod, Number(subtotal) || 0),
      shippingMethod,
      paymentMethod: paymentMethod || "pending",
    });

    const savedOrder = await order.save();
    notifyOrderCreated(savedOrder);

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/customer", authMiddleware, async (req, res) => {
  try {
    if (req.user?.role !== "customer") {
      return res.status(403).json({ message: "Customer access required." });
    }

    const { customerInfo, items, subtotal, shippingMethod = "local_delivery", paymentMethod } = req.body;

    if (!items?.length) {
      return res.status(400).json({ message: "Order requires at least one item." });
    }

    const order = new Order({
      customer: req.user.id,
      customerInfo,
      items,
      subtotal: Number(subtotal) || 0,
      shipping: getShippingFee(shippingMethod, Number(subtotal) || 0),
      shippingMethod,
      paymentMethod: paymentMethod || "pending",
    });

    const savedOrder = await order.save();
    notifyOrderCreated(savedOrder);

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Admin access required." });
    }

    const orders = await Order.find()
      .populate("customer", "name email role")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/my", authMiddleware, async (req, res) => {
  try {
    if (req.user?.role !== "customer") {
      return res.status(403).json({ message: "Customer access required." });
    }

    const orders = await Order.find({ customer: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("customer", "name email role");

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    const isOrderCustomer = order.customer && String(order.customer._id) === req.user.id;

    if (!isAdmin(req) && !isOrderCustomer) {
      return res.status(403).json({ message: "Order access denied." });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Admin access required." });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        orderStatus: req.body.orderStatus,
        paymentStatus: req.body.paymentStatus,
      },
      { new: true }
    );

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
