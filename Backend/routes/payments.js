const express = require("express");
const jwt = require("jsonwebtoken");
const Stripe = require("stripe");
const Order = require("../models/Order");
const User = require("../models/User");
const { sendOrderEmails } = require("../utils/emailService");

const router = express.Router();
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

const getStoreUrl = () => {
  const urls = (process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);

  return urls[0] || "http://localhost:5173";
};

const getOptionalCustomer = (req) => {
  const token = req.header("Authorization");

  if (!token || !process.env.JWT_SECRET) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded?.role === "customer" ? decoded : null;
  } catch (error) {
    return null;
  }
};

const notifyPaidOrder = async (order) => {
  try {
    const admins = await User.find({ role: "admin" }).select("email");
    await sendOrderEmails({
      order,
      adminEmails: admins.map((admin) => admin.email),
    });
  } catch (error) {
    console.log("Paid order email notification skipped:", error.message);
  }
};

const markCheckoutSessionPaid = async (session) => {
  const orderId = session.metadata?.orderId;

  if (!orderId) return;

  const order = await Order.findById(orderId);

  if (order && order.paymentStatus !== "paid") {
    order.paymentStatus = "paid";
    order.orderStatus = "paid";
    order.stripeSessionId = session.id;
    order.stripePaymentIntentId = session.payment_intent;
    order.paidAt = new Date();
    await order.save();
    notifyPaidOrder(order);
  }
};

router.post("/create-checkout-session", async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({ message: "Stripe is not configured." });
    }

    const { customerInfo, items, subtotal, shipping } = req.body;

    if (!items?.length) {
      return res.status(400).json({ message: "Checkout requires at least one item." });
    }

    const total = Number(subtotal) + Number(shipping || 0);

    if (!Number.isFinite(total) || total <= 0) {
      return res.status(400).json({ message: "Checkout total must be greater than zero." });
    }

    const hasInvalidItemPrice = items.some((item) => !Number.isFinite(Number(item.price)) || Number(item.price) <= 0);

    if (hasInvalidItemPrice) {
      return res.status(400).json({ message: "Every checkout item needs a valid price." });
    }

    const customer = getOptionalCustomer(req);
    const order = await Order.create({
      customer: customer?.id,
      customerInfo,
      items,
      subtotal: Number(subtotal) || 0,
      shipping: Number(shipping) || 0,
      paymentMethod: "stripe",
      paymentStatus: "pending",
      orderStatus: "received",
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "paynow"],
      customer_email: customerInfo?.email || undefined,
      line_items: items.map((item) => ({
        quantity: Number(item.quantity) || 1,
        price_data: {
          currency: "sgd",
          unit_amount: Math.round((Number(item.price) || 0) * 100),
          product_data: {
            name: item.variantLabel ? `${item.name} (${item.variantLabel})` : item.name,
            images: item.image?.startsWith("http") ? [item.image] : undefined,
          },
        },
      })),
      metadata: {
        orderId: String(order._id),
      },
      success_url: `${getStoreUrl()}/checkout/success?order=${order._id}`,
      cancel_url: `${getStoreUrl()}/checkout/cancel?order=${order._id}`,
    });

    order.stripeSessionId = session.id;
    await order.save();

    res.json({ url: session.url, orderId: order._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const webhookHandler = async (req, res) => {
  if (!stripe) {
    return res.status(500).send("Stripe is not configured.");
  }

  const signature = req.headers["stripe-signature"];
  let event = req.body;

  if (process.env.STRIPE_WEBHOOK_SECRET) {
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      if (session.payment_status === "paid") {
        await markCheckoutSessionPaid(session);
      } else if (session.metadata?.orderId) {
        await Order.findByIdAndUpdate(session.metadata.orderId, {
          paymentStatus: session.payment_status || "pending",
          stripeSessionId: session.id,
          stripePaymentIntentId: session.payment_intent,
        });
      }
    }

    if (event.type === "checkout.session.async_payment_succeeded") {
      await markCheckoutSessionPaid(event.data.object);
    }

    if (event.type === "checkout.session.async_payment_failed") {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        await Order.findByIdAndUpdate(orderId, {
          paymentStatus: "failed",
          orderStatus: "cancelled",
          stripeSessionId: session.id,
          stripePaymentIntentId: session.payment_intent,
        });
      }
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        await Order.findByIdAndUpdate(orderId, {
          paymentStatus: "expired",
          orderStatus: "cancelled",
          stripeSessionId: session.id,
        });
      }
    }

    if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object;
      await Order.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntent.id },
        { paymentStatus: "failed" }
      );
    }

    res.json({ received: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  router,
  webhookHandler,
};
