import { Link } from "react-router-dom";
import StoreLayout from "../components/StoreLayout";

function CheckoutCancelPage() {
  return (
    <>
      <style>{`
        .checkout-cancel {
          min-height: 68vh;
          padding: clamp(72px, 10vw, 130px) 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .checkout-cancel-inner {
          width: min(650px, 100%);
        }

        .checkout-cancel-kicker {
          margin: 0 0 16px;
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #c9a84c;
        }

        .checkout-cancel-title {
          margin: 0;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(48px, 8vw, 82px);
          font-weight: 300;
          line-height: 0.95;
          color: #1a0a2e;
        }

        .checkout-cancel-copy {
          margin: 24px auto 0;
          max-width: 500px;
          font-family: 'Jost', sans-serif;
          font-size: 15px;
          line-height: 1.8;
          color: rgba(45, 17, 85, 0.62);
        }

        .checkout-cancel-actions {
          margin-top: 34px;
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .checkout-cancel-link {
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

        .checkout-cancel-link.primary {
          background: #2d1155;
          border-color: #2d1155;
          color: #e8c96e;
        }

        @media (max-width: 640px) {
          .checkout-cancel {
            min-height: auto;
            padding: 48px 22px;
          }
        }
      `}</style>

      <StoreLayout>
        <section className="checkout-cancel">
          <div className="checkout-cancel-inner">
            <p className="checkout-cancel-kicker">Payment Cancelled</p>
            <h1 className="checkout-cancel-title">Still in your cart</h1>
            <p className="checkout-cancel-copy">
              No payment was taken. You can return to checkout whenever you are ready.
            </p>
            <div className="checkout-cancel-actions">
              <Link className="checkout-cancel-link primary" to="/checkout">
                Back to Checkout
              </Link>
              <Link className="checkout-cancel-link" to="/collections">
                Browse Collections
              </Link>
            </div>
          </div>
        </section>
      </StoreLayout>
    </>
  );
}

export default CheckoutCancelPage;
