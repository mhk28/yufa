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

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en-SG", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : "Just now";

const getOrderNumber = (order) => String(order._id).slice(-6).toUpperCase();

const getShippingMethodLabel = (method = "") =>
  method === "pickup" ? "Self-collection / Pickup" : "Local delivery";

const getOrderHtml = (order, heading, intro) => {
  const orderNumber = getOrderNumber(order);
  const subtotal = Number(order.subtotal) || 0;
  const shipping = Number(order.shipping) || 0;
  const total = subtotal + shipping;
  const customerName = `${order.customerInfo?.firstName || ""} ${order.customerInfo?.lastName || ""}`.trim() || "Customer";
  const items = (order.items || [])
    .map((item) => {
      const name = escapeHtml(item.name || "Yufa piece");
      const variant = item.variantLabel ? escapeHtml(item.variantLabel) : "Standard";
      const quantity = Number(item.quantity) || 1;
      const price = Number(item.price) || 0;

      return `
        <tr>
          <td style="padding:16px 0;border-bottom:1px solid #eee7d8;">
            <div style="font-family:Georgia,'Times New Roman',serif;font-size:17px;line-height:1.35;color:#1a0a2e;">${name}</div>
            <div style="margin-top:6px;font-family:Arial,sans-serif;font-size:12px;letter-spacing:1.8px;text-transform:uppercase;color:#7f7095;">${variant}</div>
          </td>
          <td align="center" style="padding:16px 10px;border-bottom:1px solid #eee7d8;font-family:Arial,sans-serif;font-size:14px;color:#1a0a2e;">${quantity}</td>
          <td align="right" style="padding:16px 0;border-bottom:1px solid #eee7d8;font-family:Arial,sans-serif;font-size:14px;font-weight:700;color:#2d1155;">${formatCurrency(price * quantity)}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <!doctype html>
    <html>
      <body style="margin:0;padding:0;background:#fbf8f3;color:#1a0a2e;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fbf8f3;">
          <tr>
            <td align="center" style="padding:32px 14px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#fffdf9;border:1px solid #eadfca;">
                <tr>
                  <td style="padding:28px 28px 20px;text-align:center;border-bottom:1px solid #eadfca;">
                    <img src="https://www.yufacollections.sg/images/yufa-logo.png" width="82" height="82" alt="Yufa Collections" style="display:block;margin:0 auto 18px;border:0;object-fit:contain;">
                    <div style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:3.5px;text-transform:uppercase;color:#8b789d;">Yufa Collections</div>
                    <h1 style="margin:10px 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:34px;line-height:1.1;font-weight:400;color:#2d1155;">${escapeHtml(heading)}</h1>
                    <p style="margin:0 auto;max-width:470px;font-family:Arial,sans-serif;font-size:14px;line-height:1.7;color:#6f6281;">${escapeHtml(intro)}</p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:24px 28px 0;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding:15px 18px;background:#2d1155;color:#fffdf9;">
                          <div style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:2.4px;text-transform:uppercase;color:#e7c96c;">Order</div>
                          <div style="margin-top:4px;font-family:Georgia,'Times New Roman',serif;font-size:24px;">#${orderNumber}</div>
                        </td>
                        <td align="right" style="padding:15px 18px;background:#2d1155;color:#fffdf9;">
                          <div style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:2.4px;text-transform:uppercase;color:#e7c96c;">Placed</div>
                          <div style="margin-top:6px;font-family:Arial,sans-serif;font-size:13px;">${formatDate(order.createdAt)}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:26px 28px 0;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding-bottom:10px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2.6px;text-transform:uppercase;color:#8b789d;">Piece</td>
                        <td align="center" style="padding-bottom:10px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2.6px;text-transform:uppercase;color:#8b789d;">Qty</td>
                        <td align="right" style="padding-bottom:10px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2.6px;text-transform:uppercase;color:#8b789d;">Total</td>
                      </tr>
                      ${items}
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:22px 28px 4px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:14px;color:#6f6281;">Subtotal</td>
                        <td align="right" style="padding:6px 0;font-family:Arial,sans-serif;font-size:14px;color:#1a0a2e;">${formatCurrency(subtotal)}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:14px;color:#6f6281;">${getShippingMethodLabel(order.shippingMethod)}</td>
                        <td align="right" style="padding:6px 0;font-family:Arial,sans-serif;font-size:14px;color:#1a0a2e;">${shipping ? formatCurrency(shipping) : "Free"}</td>
                      </tr>
                      <tr>
                        <td style="padding:14px 0 4px;border-top:1px solid #eadfca;font-family:Georgia,'Times New Roman',serif;font-size:22px;color:#2d1155;">Total</td>
                        <td align="right" style="padding:14px 0 4px;border-top:1px solid #eadfca;font-family:Georgia,'Times New Roman',serif;font-size:24px;color:#2d1155;">${formatCurrency(total)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:22px 28px 28px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="50%" valign="top" style="padding:18px;background:#fbf8f3;border:1px solid #eadfca;">
                          <div style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:#8b789d;">Customer</div>
                          <p style="margin:10px 0 0;font-family:Arial,sans-serif;font-size:14px;line-height:1.7;color:#1a0a2e;">
                            ${escapeHtml(customerName)}<br>
                            ${escapeHtml(order.customerInfo?.email || "No email provided")}<br>
                            ${escapeHtml(order.customerInfo?.phone || "No phone provided")}
                          </p>
                        </td>
                        <td width="16" style="font-size:0;line-height:0;">&nbsp;</td>
                        <td width="50%" valign="top" style="padding:18px;background:#fbf8f3;border:1px solid #eadfca;">
                          <div style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:#8b789d;">${getShippingMethodLabel(order.shippingMethod)}</div>
                          <p style="margin:10px 0 0;font-family:Arial,sans-serif;font-size:14px;line-height:1.7;color:#1a0a2e;">
                            ${escapeHtml(order.customerInfo?.address || "No address provided")}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:0 28px 30px;">
                    <div style="padding:18px 20px;background:#fff8e6;border-left:3px solid #c9a84c;">
                      <div style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:#8b789d;">Payment</div>
                      <p style="margin:8px 0 0;font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#1a0a2e;">
                        ${escapeHtml(order.paymentMethod || "pending")} / ${escapeHtml(order.paymentStatus || "pending")}
                      </p>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="padding:24px 28px;text-align:center;background:#1a0a2e;">
                    <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:18px;color:#fffdf9;">Thank you for shopping with Yufa.</p>
                    <p style="margin:10px 0 0;font-family:Arial,sans-serif;font-size:13px;line-height:1.7;color:#d8cdea;">
                      For order enquiries, reply to this email or contact
                      <a href="mailto:admin@yufacollections.com" style="color:#e7c96c;text-decoration:none;">admin@yufacollections.com</a>.
                    </p>
                    <p style="margin:18px 0 0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:2.8px;text-transform:uppercase;color:#a897bc;">yufacollections.sg</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
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
      html: getOrderHtml(
        order,
        "Thank you for your order",
        "We have received your Yufa order. Our team will prepare your pieces and contact you if any delivery details need confirming."
      ),
    }),
    sendEmail({
      to: adminRecipients,
      cc: sharedCc,
      subject: `New Yufa order #${String(order._id).slice(-6).toUpperCase()}`,
      html: getOrderHtml(
        order,
        "New order received",
        "A customer has placed an order through the Yufa storefront. Review the order details below before fulfilment."
      ),
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
