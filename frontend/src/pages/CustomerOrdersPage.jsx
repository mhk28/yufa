import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StoreLayout from "../components/StoreLayout";
import { useCustomerAuth } from "../context/CustomerAuthContext";
import { API_BASE_URL, formatCurrency } from "../utils/storefront";

function CustomerOrdersPage() {
  const { token, isAuthenticated } = useCustomerAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/orders/my`, {
          headers: { Authorization: token },
        });
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [token]);

  return (
    <>
      <style>{`
        .orders-page {
          padding: clamp(54px, 8vw, 104px) clamp(22px, 5vw, 72px);
        }

        .orders-inner {
          width: min(980px, 100%);
          margin: 0 auto;
          text-align: left;
        }

        .orders-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(46px, 7vw, 74px);
          font-weight: 300;
          margin: 0 0 30px;
          color: #1a0a2e;
        }

        .order-card {
          background: #fff;
          border: 1px solid rgba(201, 168, 76, 0.16);
          padding: 24px;
          margin-bottom: 16px;
        }

        .order-top {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          border-bottom: 1px solid rgba(201, 168, 76, 0.12);
          padding-bottom: 14px;
          margin-bottom: 14px;
        }

        .order-id {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          color: #1a0a2e;
        }

        .order-meta,
        .order-item {
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          color: rgba(45, 17, 85, 0.58);
          line-height: 1.7;
        }

        .empty-orders {
          background: #fff;
          border: 1px solid rgba(201, 168, 76, 0.16);
          padding: 48px;
          text-align: center;
        }
      `}</style>

      <StoreLayout>
        <section className="orders-page">
          <div className="orders-inner">
            <h1 className="orders-title">Your Orders</h1>
            {!isAuthenticated ? (
              <div className="empty-orders">
                <p className="order-meta">Please sign in to view your orders.</p>
                <Link to="/login">Sign in</Link>
              </div>
            ) : loading ? (
              <div className="empty-orders"><p className="order-meta">Loading orders...</p></div>
            ) : orders.length === 0 ? (
              <div className="empty-orders"><p className="order-meta">No orders yet.</p></div>
            ) : (
              orders.map((order) => (
                <div className="order-card" key={order._id}>
                  <div className="order-top">
                    <div>
                      <div className="order-id">Order #{order._id.slice(-6).toUpperCase()}</div>
                      <div className="order-meta">{new Date(order.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="order-meta">
                      {order.orderStatus} | {formatCurrency(order.subtotal + order.shipping)}
                    </div>
                  </div>
                  {order.items.map((item, index) => (
                    <div className="order-item" key={`${item.productId}-${index}`}>
                      {item.name} x {item.quantity} - {formatCurrency(item.price * item.quantity)}
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </section>
      </StoreLayout>
    </>
  );
}

export default CustomerOrdersPage;
