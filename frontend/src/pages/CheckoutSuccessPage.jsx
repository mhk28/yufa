import { Link, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import StoreLayout from "../components/StoreLayout";
import { useCart } from "../context/CartContext";

function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const orderId = searchParams.get("order");

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <>
      <style>{`
        .checkout-result {
          min-height: 68vh;
          padding: clamp(72px, 10vw, 130px) 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .checkout-result-inner {
          width: min(680px, 100%);
        }

        .checkout-result-kicker {
          margin: 0 0 16px;
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #c9a84c;
        }

        .checkout-result-title {
          margin: 0;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(52px, 8vw, 86px);
          font-weight: 300;
          line-height: 0.95;
          color: #1a0a2e;
        }

        .checkout-result-copy {
          margin: 24px auto 0;
          max-width: 520px;
          font-family: 'Jost', sans-serif;
          font-size: 15px;
          line-height: 1.8;
          color: rgba(45, 17, 85, 0.62);
        }

        .checkout-result-actions {
          margin-top: 34px;
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .checkout-result-link {
          min-height: 48px;
          padding: 0 22px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(45, 17, 85, 0.18);
          color: #2d1155;
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          text-decoration: none;
        }

        .checkout-result-link.primary {
          background: #2d1155;
          border-color: #2d1155;
          color: #e8c96e;
        }
      `}</style>

      <StoreLayout>
        <section className="checkout-result">
          <div className="checkout-result-inner">
            <p className="checkout-result-kicker">Payment Received</p>
            <h1 className="checkout-result-title">Thank you</h1>
            <p className="checkout-result-copy">
              Your order has been received. Stripe will confirm payment with Yufa in the background,
              and your order will appear in the admin orders page once confirmed.
              {orderId ? ` Order reference: ${orderId.slice(-6).toUpperCase()}.` : ""}
            </p>
            <div className="checkout-result-actions">
              <Link className="checkout-result-link primary" to="/collections">
                Continue Shopping
              </Link>
              <Link className="checkout-result-link" to="/orders">
                View Orders
              </Link>
            </div>
          </div>
        </section>
      </StoreLayout>
    </>
  );
}

export default CheckoutSuccessPage;
