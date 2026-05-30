const { Resend } = require("resend");

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const ADMIN_CC_EMAIL = "muhammadhasankhan374@gmail.com";

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

const sendEmail = async ({ to, cc, subject, html }) => {
  if (!resend || !to?.length) {
    return { skipped: true };
  }

  return resend.emails.send({
    from: process.env.EMAIL_FROM || "Yufa Collections <onboarding@resend.dev>",
    to,
    cc,
    subject,
    html,
  });
};

const sendOrderEmails = async ({ order, adminEmails = [] }) => {
  const customerEmail = order.customerInfo?.email;
  const adminRecipients = [...new Set(adminEmails.filter(Boolean))];

  await Promise.allSettled([
    sendEmail({
      to: customerEmail ? [customerEmail] : [],
      subject: `Yufa Collections order #${String(order._id).slice(-6).toUpperCase()}`,
      html: getOrderHtml(order, "Thank you for your order"),
    }),
    sendEmail({
      to: adminRecipients,
      cc: [ADMIN_CC_EMAIL],
      subject: `New Yufa order #${String(order._id).slice(-6).toUpperCase()}`,
      html: getOrderHtml(order, "New order received"),
    }),
  ]);
};

module.exports = {
  sendOrderEmails,
};
