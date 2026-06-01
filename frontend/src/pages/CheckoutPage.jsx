import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import StoreLayout from "../components/StoreLayout";
import { useCart } from "../context/CartContext";
import { useCustomerAuth } from "../context/CustomerAuthContext";
import { API_BASE_URL, formatCurrency } from "../utils/storefront";

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { token, isAuthenticated, user } = useCustomerAuth();
  const [customerInfo, setCustomerInfo] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
    email: user?.email || "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("stripe");

  const updateField = (field, value) => {
    setCustomerInfo((currentInfo) => ({ ...currentInfo, [field]: value }));
  };

  const handlePlaceOrder = async () => {
    setError("");
    setPlacing(true);

    try {
      if (paymentMethod === "stripe") {
        const response = await fetch(`${API_BASE_URL}/payments/create-checkout-session`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(isAuthenticated ? { Authorization: token } : {}),
          },
          body: JSON.stringify({
            customerInfo,
            items,
            subtotal,
            shipping: 0,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to start Stripe checkout.");
        }

        window.location.href = data.url;
        return;
      }

      const endpoint = isAuthenticated ? "/orders/customer" : "/orders";
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(isAuthenticated ? { Authorization: token } : {}),
        },
        body: JSON.stringify({
          customerInfo,
          items,
          subtotal,
          shipping: 0,
          paymentMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to place order.");
      }

      clearCart();
      navigate(isAuthenticated ? "/orders" : "/collections");
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Jost:wght@300;400;500&display=swap');

        .checkout-page {
          padding: clamp(54px, 8vw, 104px) clamp(22px, 5vw, 72px);
        }

        .checkout-inner {
          width: min(1180px, 100%);
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 34px;
          align-items: start;
        }

        .checkout-form-panel,
        .checkout-summary {
          background: #fff;
          border: 1px solid rgba(201, 168, 76, 0.16);
          padding: 30px;
          text-align: left;
        }

        .checkout-eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #c9a84c;
          margin: 0 0 12px;
        }

        .checkout-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(46px, 7vw, 74px);
          font-weight: 300;
          line-height: 0.95;
          color: #1a0a2e;
          margin: 0 0 28px;
        }

        .checkout-section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          font-weight: 400;
          color: #1a0a2e;
          margin: 0 0 18px;
        }

        .payment-section-title {
          margin-top: 34px;
        }

        .checkout-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .checkout-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .checkout-field.full {
          grid-column: 1 / -1;
        }

        .checkout-label {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(45, 17, 85, 0.52);
        }

        .checkout-input,
        .checkout-textarea {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid rgba(201, 168, 76, 0.24);
          background: #fdfcfb;
          color: #1a0a2e;
          font-family: 'Jost', sans-serif;
          font-size: 14px;
          outline: none;
        }

        .checkout-textarea {
          min-height: 96px;
          resize: vertical;
        }

        .payment-note {
          margin-top: 24px;
          padding: 16px;
          background: rgba(201, 168, 76, 0.06);
          border: 1px solid rgba(201, 168, 76, 0.16);
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          line-height: 1.7;
          color: rgba(45, 17, 85, 0.58);
        }

        .account-note {
          margin-bottom: 22px;
          padding: 14px 16px;
          border: 1px solid rgba(201, 168, 76, 0.16);
          background: rgba(201, 168, 76, 0.055);
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          color: rgba(45, 17, 85, 0.6);
          line-height: 1.7;
        }

        .account-note a {
          color: #2d1155;
          font-weight: 500;
          text-decoration-color: rgba(201, 168, 76, 0.8);
        }

        .payment-options {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-top: 22px;
        }

        .payment-option {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 14px;
          min-height: 88px;
          padding: 16px;
          border: 1px solid rgba(201, 168, 76, 0.18);
          background: #fdfcfb;
          color: #1a0a2e;
          cursor: pointer;
          text-align: left;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
        }

        .payment-option:hover {
          border-color: rgba(201, 168, 76, 0.42);
          transform: translateY(-1px);
        }

        .payment-option.active {
          border-color: #c9a84c;
          box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.1);
        }

        .payment-copy {
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-width: 0;
          align-items: flex-start;
          text-align: left;
        }

        .payment-name {
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #1a0a2e;
          line-height: 1.2;
          text-align: left;
        }

        .payment-detail {
          font-family: 'Jost', sans-serif;
          font-size: 12px;
          color: rgba(45, 17, 85, 0.48);
          line-height: 1.35;
          text-align: left;
        }

        .payment-logo {
          width: 82px;
          height: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
          border-radius: 8px;
          background: #fff;
          box-shadow:
            0 10px 22px rgba(45, 17, 85, 0.12),
            0 2px 6px rgba(45, 17, 85, 0.08);
        }

        .payment-logo img {
          width: 82px;
          height: 34px;
          display: block;
          object-fit: contain;
          border-radius: 8px;
        }

        .checkout-error {
          margin-top: 18px;
          padding: 12px 14px;
          background: rgba(192, 57, 43, 0.06);
          border: 1px solid rgba(192, 57, 43, 0.2);
          color: #c0392b;
          font-family: 'Jost', sans-serif;
          font-size: 13px;
        }

        .checkout-summary {
          position: sticky;
          top: 94px;
        }

        .summary-item,
        .summary-total-row {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          padding: 14px 0;
          border-top: 1px solid rgba(201, 168, 76, 0.12);
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          color: rgba(45, 17, 85, 0.62);
        }

        .summary-total-row {
          align-items: baseline;
        }

        .summary-total-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 30px;
          color: #1a0a2e;
        }

        .place-order-button,
        .back-cart-link {
          width: 100%;
          min-height: 48px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-top: 14px;
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          text-decoration: none;
        }

        .place-order-button {
          border: none;
          background: #2d1155;
          color: #e8c96e;
          cursor: pointer;
        }

        .place-order-button:disabled {
          opacity: 0.52;
          cursor: not-allowed;
        }

        .back-cart-link {
          border: 1px solid rgba(45, 17, 85, 0.18);
          color: #2d1155;
        }

        @media (max-width: 900px) {
          .checkout-inner {
            grid-template-columns: 1fr;
          }

          .checkout-summary {
            position: static;
          }
        }

        @media (max-width: 620px) {
          .checkout-page {
            padding: 38px 20px 64px;
          }

          .checkout-form-panel,
          .checkout-summary {
            padding: 24px 20px;
          }

          .checkout-grid {
            grid-template-columns: 1fr;
          }

          .payment-options {
            grid-template-columns: 1fr;
          }

          .payment-option {
            min-height: 78px;
            padding: 14px;
          }
        }
      `}</style>

      <StoreLayout>
        <section className="checkout-page">
          <div className="checkout-inner">
            <div className="checkout-form-panel">
              <p className="checkout-eyebrow">Checkout</p>
              <h1 className="checkout-title">Delivery details</h1>

              {!isAuthenticated && (
                <div className="account-note">
                  Checking out as a guest. <Link to="/login">Sign in</Link> or <Link to="/register">create an account</Link> to save your order history.
                </div>
              )}

              <h2 className="checkout-section-title">Customer Information</h2>
              <div className="checkout-grid">
                <div className="checkout-field">
                  <label className="checkout-label">First Name</label>
                  <input
                    className="checkout-input"
                    type="text"
                    value={customerInfo.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                  />
                </div>
                <div className="checkout-field">
                  <label className="checkout-label">Last Name</label>
                  <input
                    className="checkout-input"
                    type="text"
                    value={customerInfo.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                  />
                </div>
                <div className="checkout-field">
                  <label className="checkout-label">Email</label>
                  <input
                    className="checkout-input"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => updateField("email", e.target.value)}
                  />
                </div>
                <div className="checkout-field">
                  <label className="checkout-label">Phone</label>
                  <input
                    className="checkout-input"
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                  />
                </div>
                <div className="checkout-field full">
                  <label className="checkout-label">Address</label>
                  <textarea
                    className="checkout-textarea"
                    value={customerInfo.address}
                    onChange={(e) => updateField("address", e.target.value)}
                  />
                </div>
              </div>

              <h2 className="checkout-section-title payment-section-title">Payment Method</h2>
              <div className="payment-options" aria-label="Payment methods">
                {[
                  {
                    id: "stripe",
                    name: "Stripe Checkout",
                    detail: "Cards and supported wallets",
                    logo: "/images/stripe.png",
                    className: "",
                  },
                  {
                    id: "paynow",
                    name: "PayNow",
                    detail: "Manual transfer for now",
                    logo: "/images/paynow.jpg",
                    className: "paynow",
                  },
                  {
                    id: "card",
                    name: "Cards",
                    detail: "Visa, Mastercard later",
                    logo: "/images/visa-mastercard.jpg",
                    className: "card",
                  },
                  {
                    id: "apple_pay",
                    name: "Apple Pay",
                    detail: "Via Stripe later",
                    logo: "/images/apple-pay.png",
                    className: "apple",
                  },
                ].map((method) => (
                  <button
                    key={method.id}
                    className={`payment-option ${paymentMethod === method.id ? "active" : ""}`}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <span className="payment-copy">
                      <span className="payment-name">{method.name}</span>
                      <span className="payment-detail">{method.detail}</span>
                    </span>
                    <span className={`payment-logo ${method.className}`}>
                      <img src={method.logo} alt={`${method.name} logo`} />
                    </span>
                  </button>
                ))}
              </div>

              <div className="payment-note">
                Stripe opens a secure hosted checkout in test mode. PayNow is kept as a manual option
                until the business is ready to accept non-card payments.
              </div>
              {error && <div className="checkout-error">{error}</div>}
            </div>

            <aside className="checkout-summary">
              <h2 className="checkout-section-title">Order Summary</h2>
              {items.length === 0 ? (
                <p className="payment-note">Your cart is empty.</p>
              ) : (
                items.map((item) => (
                  <div className="summary-item" key={`${item.productId}-${item.variantKey || "base"}`}>
                    <span>{item.name} x {item.quantity}</span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))
              )}
              <div className="summary-total-row">
                <span>Total</span>
                <span className="summary-total-value">{formatCurrency(subtotal)}</span>
              </div>
              <button
                className="place-order-button"
                type="button"
                disabled={items.length === 0 || placing}
                onClick={handlePlaceOrder}
              >
                {placing ? "Placing..." : paymentMethod === "stripe" ? "Pay Now" : "Place Order"}
              </button>
              <Link className="back-cart-link" to="/cart">
                Back to Cart
              </Link>
            </aside>
          </div>
        </section>
      </StoreLayout>
    </>
  );
}

export default CheckoutPage;
