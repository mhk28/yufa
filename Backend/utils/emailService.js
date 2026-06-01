const { Resend } = require("resend");

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const BUSINESS_ADMIN_EMAIL = "admin@yufacollections.com";

const splitEmails = (value = "") =>
  value
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);

const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
  }).format(Number(amount) || 0);

const getOrderHtml = (order, heading) => {
  const items = order.items
    .map(
      (item) =>
        `<li>${item.name} ${item.variantLabel ? `(${item.variantLabel})` : ""} x ${item.quantity} - ${formatCurrency(item.price * item.quantity)}</li>`
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;color:#1a0a2e;line-height:1.6">
      <h1 style="font-family:Georgia,serif;color:#2d1155">${heading}</h1>
      <p>Order <strong>#${String(order._id).slice(-6).toUpperCase()}</strong></p>
      <p><strong>Customer:</strong> ${order.customerInfo?.firstName || ""} ${order.customerInfo?.lastName || ""}</p>
      <p><strong>Email:</strong> ${order.customerInfo?.email || ""}</p>
      <p><strong>Phone:</strong> ${order.customerInfo?.phone || ""}</p>
      <p><strong>Address:</strong> ${order.customerInfo?.address || ""}</p>
      <ul>${items}</ul>
      <p><strong>Total:</strong> ${formatCurrency((order.subtotal || 0) + (order.shipping || 0))}</p>
      <p><strong>Payment:</strong> ${order.paymentMethod || "pending"} / ${order.paymentStatus || "pending"}</p>
    </div>
  `;
};

const sendEmail = async ({ to, cc = [], subject, html }) => {
  if (!resend || !to?.length) {
    console.log("Email skipped:", {
      hasResendKey: Boolean(resend),
      recipientCount: to?.length || 0,
      subject,
    });
    return { skipped: true };
  }

  const emailPayload = {
    from: process.env.EMAIL_FROM || "Yufa Collections <onboarding@resend.dev>",
    to,
    cc: [...new Set(cc.filter(Boolean))],
    subject,
    html,
  };

  if (process.env.EMAIL_REPLY_TO) {
    emailPayload.replyTo = process.env.EMAIL_REPLY_TO;
  }

  return resend.emails.send(emailPayload);
};

const sendOrderEmails = async ({ order, adminEmails = [] }) => {
  const customerEmail = order.customerInfo?.email;
  const adminRecipients = [...new Set(adminEmails.filter(Boolean))];
  const sharedCc = [...new Set([
    BUSINESS_ADMIN_EMAIL,
    ...splitEmails(process.env.ORDER_EMAIL_CC),
  ])];

  const results = await Promise.allSettled([
    sendEmail({
      to: customerEmail ? [customerEmail] : [],
      cc: sharedCc,
      subject: `Yufa Collections order #${String(order._id).slice(-6).toUpperCase()}`,
      html: getOrderHtml(order, "Thank you for your order"),
    }),
    sendEmail({
      to: adminRecipients,
      cc: sharedCc,
      subject: `New Yufa order #${String(order._id).slice(-6).toUpperCase()}`,
      html: getOrderHtml(order, "New order received"),
    }),
  ]);

  results.forEach((result, index) => {
    if (result.status === "rejected") {
      console.log(
        `Order email ${index === 0 ? "customer" : "admin"} failed:`,
        result.reason?.message || result.reason
      );
    }
  });
};

module.exports = {
  sendEmail,
  sendOrderEmails,
};
