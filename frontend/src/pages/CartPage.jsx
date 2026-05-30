import { Link, useNavigate } from "react-router-dom";
import StoreLayout from "../components/StoreLayout";
import { useCart } from "../context/CartContext";
import { formatCurrency, getImageUrl } from "../utils/storefront";

function CartPage() {
  const navigate = useNavigate();
  const { items, subtotal, removeItem, updateQuantity } = useCart();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Jost:wght@300;400;500&display=swap');

        .cart-page {
          padding: clamp(54px, 8vw, 104px) clamp(22px, 5vw, 72px);
        }

        .cart-inner {
          width: min(1180px, 100%);
          margin: 0 auto;
        }

        .cart-header {
          margin-bottom: 34px;
          padding-bottom: 22px;
          border-bottom: 1px solid rgba(201, 168, 76, 0.18);
          text-align: left;
        }

        .cart-eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #c9a84c;
          margin: 0 0 12px;
        }

        .cart-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(48px, 7vw, 78px);
          font-weight: 300;
          line-height: 0.95;
          color: #1a0a2e;
          margin: 0;
        }

        .cart-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 34px;
          align-items: start;
        }

        .cart-list,
        .cart-summary {
          background: #fff;
          border: 1px solid rgba(201, 168, 76, 0.16);
        }

        .cart-item {
          display: grid;
          grid-template-columns: 96px 1fr auto;
          gap: 18px;
          padding: 22px;
          border-bottom: 1px solid rgba(201, 168, 76, 0.12);
          align-items: center;
        }

        .cart-item:last-child {
          border-bottom: none;
        }

        .cart-image {
          aspect-ratio: 4 / 5;
          width: 96px;
          background: #efe7df;
          object-fit: cover;
        }

        .cart-item-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 25px;
          color: #1a0a2e;
          margin: 0 0 6px;
        }

        .cart-item-meta,
        .cart-remove {
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .cart-item-meta {
          color: rgba(45, 17, 85, 0.46);
          margin: 0 0 14px;
        }

        .cart-remove {
          border: none;
          padding: 0 0 0 18px;
          border-left: 1px solid rgba(201, 168, 76, 0.18);
          color: #c0392b;
          background: transparent;
          cursor: pointer;
          min-height: 36px;
        }

        .quantity-control {
          display: inline-flex;
          align-items: center;
          border: 1px solid rgba(201, 168, 76, 0.24);
        }

        .cart-item-controls {
          display: flex;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;
        }

        .quantity-control button,
        .quantity-control span {
          width: 38px;
          height: 36px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: transparent;
          color: #2d1155;
          font-family: 'Jost', sans-serif;
        }

        .quantity-control button {
          cursor: pointer;
        }

        .cart-line-price {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          color: #2d1155;
          white-space: nowrap;
        }

        .cart-summary {
          padding: 26px;
          text-align: left;
          position: sticky;
          top: 94px;
        }

        .summary-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 30px;
          font-weight: 400;
          margin: 0 0 22px;
          color: #1a0a2e;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          padding: 15px 0;
          border-top: 1px solid rgba(201, 168, 76, 0.12);
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          color: rgba(45, 17, 85, 0.62);
        }

        .summary-total {
          font-family: 'Cormorant Garamond', serif;
          font-size: 30px;
          color: #1a0a2e;
        }

        .checkout-button,
        .continue-link {
          width: 100%;
          min-height: 48px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-top: 14px;
          text-decoration: none;
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .checkout-button {
          border: none;
          background: #2d1155;
          color: #e8c96e;
          cursor: pointer;
        }

        .continue-link {
          border: 1px solid rgba(45, 17, 85, 0.18);
          color: #2d1155;
        }

        .empty-cart {
          padding: 74px 24px;
          text-align: center;
          background: #fff;
          border: 1px solid rgba(201, 168, 76, 0.16);
        }

        .empty-cart p {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          font-style: italic;
          color: rgba(45, 17, 85, 0.42);
          margin: 0 0 22px;
        }

        @media (max-width: 900px) {
          .cart-grid {
            grid-template-columns: 1fr;
          }

          .cart-summary {
            position: static;
          }
        }

        @media (max-width: 620px) {
          .cart-page {
            padding: 38px 20px 64px;
          }

          .cart-item {
            grid-template-columns: 78px 1fr;
          }

          .cart-image {
            width: 78px;
          }

          .cart-line-price {
            grid-column: 1 / -1;
            text-align: right;
          }

          .cart-item-controls {
            align-items: flex-start;
            flex-direction: column;
            gap: 12px;
          }

          .cart-remove {
            padding-left: 0;
            border-left: none;
          }
        }
      `}</style>

      <StoreLayout>
        <section className="cart-page">
          <div className="cart-inner">
            <div className="cart-header">
              <p className="cart-eyebrow">Shopping Bag</p>
              <h1 className="cart-title">Your Cart</h1>
            </div>

            {items.length === 0 ? (
              <div className="empty-cart">
                <p>Your cart is quietly waiting.</p>
                <Link className="continue-link" to="/collections">
                  Browse Collections
                </Link>
              </div>
            ) : (
              <div className="cart-grid">
                <div className="cart-list">
                  {items.map((item) => (
                    <div className="cart-item" key={`${item.productId}-${item.variantKey || "base"}`}>
                      {item.image ? (
                        <img className="cart-image" src={getImageUrl(item.image)} alt={item.name} />
                      ) : (
                        <div className="cart-image" />
                      )}
                      <div>
                        <h2 className="cart-item-name">{item.name}</h2>
                        <p className="cart-item-meta">
                          {item.variantLabel || "Standard"} | {formatCurrency(item.price)}
                        </p>
                        <div className="cart-item-controls">
                          <div className="quantity-control">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.productId, item.variantKey, item.quantity - 1)}
                            >
                              -
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.productId, item.variantKey, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                          <button
                            className="cart-remove"
                            type="button"
                            onClick={() => removeItem(item.productId, item.variantKey)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="cart-line-price">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <aside className="cart-summary">
                  <h2 className="summary-title">Summary</h2>
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span>Calculated later</span>
                  </div>
                  <div className="summary-row">
                    <span>Total</span>
                    <span className="summary-total">{formatCurrency(subtotal)}</span>
                  </div>
                  <button className="checkout-button" type="button" onClick={() => navigate("/checkout")}>
                    Checkout
                  </button>
                  <Link className="continue-link" to="/collections">
                    Continue Shopping
                  </Link>
                </aside>
              </div>
            )}
          </div>
        </section>
      </StoreLayout>
    </>
  );
}

export default CartPage;
