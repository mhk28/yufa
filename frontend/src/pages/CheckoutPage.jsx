import { useState } from "react";
import { Link } from "react-router-dom";
import StoreLayout from "../components/StoreLayout";
import { useCart } from "../context/CartContext";
import { useCustomerAuth } from "../context/CustomerAuthContext";
import { API_BASE_URL, formatCurrency } from "../utils/storefront";

function CheckoutPage() {
  const { items, subtotal } = useCart();
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

  const updateField = (field, value) => {
    setCustomerInfo((currentInfo) => ({ ...currentInfo, [field]: value }));
  };

  const handlePlaceOrder = async () => {
    setError("");
    setPlacing(true);

    try {
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

        .accepted-payments {
          margin-top: 22px;
          padding: 18px;
          border: 1px solid rgba(201, 168, 76, 0.18);
          background: #fdfcfb;
        }

        .accepted-heading {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 16px;
        }

        .accepted-title {
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #1a0a2e;
          margin: 0;
        }

        .accepted-security {
          font-family: 'Jost', sans-serif;
          font-size: 12px;
          color: rgba(45, 17, 85, 0.48);
          margin: 0;
        }

        .accepted-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 10px;
        }

        .accepted-method {
          min-height: 78px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 10px;
          border: 1px solid rgba(201, 168, 76, 0.16);
          background: #fff;
          text-align: center;
        }

        .accepted-logo {
          width: 80px;
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

        .accepted-logo img {
          width: 80px;
          height: 34px;
          display: block;
          object-fit: contain;
          border-radius: 8px;
        }

        .accepted-name {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(45, 17, 85, 0.58);
          line-height: 1.25;
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

          .accepted-heading {
            flex-direction: column;
            gap: 6px;
          }

          .accepted-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .accepted-method {
            min-height: 74px;
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

              <h2 className="checkout-section-title payment-section-title">Payment</h2>
              <div className="accepted-payments" aria-label="Accepted payment methods">
                <div className="accepted-heading">
                  <p className="accepted-title">We Accept</p>
                  <p className="accepted-security">Securely processed by Stripe Checkout</p>
                </div>
                <div className="accepted-grid">
                  {[
                  {
                    id: "stripe",
                    name: "Stripe",
                    logo: "/images/stripe.png",
                  },
                  {
                    id: "paynow",
                    name: "PayNow",
                    logo: "/images/paynow.jpg",
                  },
                  {
                    id: "card",
                    name: "Visa / Mastercard",
                    logo: "/images/visa-mastercard.jpg",
                  },
                  {
                    id: "apple_pay",
                    name: "Apple Pay",
                    logo: "/images/apple-pay.png",
                  },
                  {
                    id: "google_pay",
                    name: "Google Pay",
                    logo: "/images/google-pay.png",
                  },
                  ].map((method) => (
                    <div className="accepted-method" key={method.id}>
                    <span className="accepted-logo">
                      <img src={method.logo} alt={`${method.name} logo`} />
                    </span>
                      <span className="accepted-name">{method.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="payment-note">
                Press Pay Now to continue to Stripe's secure checkout. Stripe will show the payment methods
                available for your device, browser, and checkout amount.
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
                {placing ? "Opening Stripe..." : "Pay Now"}
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
