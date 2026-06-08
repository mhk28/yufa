import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { API_BASE_URL, formatCurrency } from "../utils/storefront";

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/orders`, {
        headers: { Authorization: token },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load orders.");
      }

      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
      setError(error.message || "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const stats = useMemo(() => {
    const sales = orders.reduce(
      (total, order) => total + (Number(order.subtotal) || 0) + (Number(order.shipping) || 0),
      0
    );
    const pending = orders.filter((order) => order.orderStatus === "received").length;

    return { sales, pending };
  }, [orders]);

  const updateStatus = async (order, orderStatus) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE_URL}/orders/${order._id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          orderStatus,
          paymentStatus: order.paymentStatus,
        }),
      });
      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <style>{`
        .admin-page-header {
          margin-bottom: 28px;
          padding-bottom: 22px;
          border-bottom: 1px solid rgba(201, 168, 76, 0.2);
          text-align: left;
        }

        .admin-eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #c9a84c;
          margin-bottom: 10px;
        }

        .admin-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 38px;
          font-weight: 400;
          margin: 0;
          color: #1a0a2e;
        }

        .admin-stat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .admin-stat-card,
        .order-admin-card {
          background: #fff;
          border: 1px solid rgba(201, 168, 76, 0.16);
          border-radius: 8px;
        }

        .admin-stat-card {
          padding: 22px;
          text-align: left;
        }

        .admin-stat-label {
          display: block;
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(45, 17, 85, 0.45);
          margin-bottom: 12px;
        }

        .admin-stat-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 36px;
          color: #2d1155;
        }

        .order-admin-card {
          padding: 24px;
          margin-bottom: 16px;
          text-align: left;
        }

        .order-admin-top {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          border-bottom: 1px solid rgba(201, 168, 76, 0.12);
          padding-bottom: 14px;
          margin-bottom: 14px;
        }

        .order-admin-id {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          color: #1a0a2e;
          text-decoration: none;
        }

        .order-admin-meta,
        .order-admin-item {
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          color: rgba(45, 17, 85, 0.62);
          line-height: 1.7;
        }

        .order-status-select {
          padding: 10px 12px;
          border: 1px solid rgba(201, 168, 76, 0.24);
          background: #fdfcfb;
          font-family: 'Jost', sans-serif;
        }

        .order-empty {
          padding: 24px;
          background: #fff;
          border: 1px solid rgba(201, 168, 76, 0.16);
          border-radius: 8px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-style: italic;
          color: rgba(45, 17, 85, 0.45);
          text-align: left;
        }

        .order-error {
          padding: 18px;
          margin-bottom: 18px;
          border: 1px solid rgba(192, 57, 43, 0.22);
          background: rgba(192, 57, 43, 0.06);
          color: #9f2f25;
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          line-height: 1.6;
          text-align: left;
        }

        @media (max-width: 760px) {
          .admin-stat-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 9px;
          }

          .admin-page-header {
            margin-bottom: 18px;
          }

          .admin-title {
            font-size: 32px;
          }

          .admin-stat-card {
            padding: 13px 10px;
          }

          .admin-stat-label {
            font-size: 8px;
            letter-spacing: 0.1em;
            margin-bottom: 8px;
          }

          .admin-stat-value {
            font-size: 24px;
            overflow-wrap: anywhere;
          }

          .order-admin-card {
            padding: 14px;
            margin-bottom: 10px;
          }

          .order-admin-top {
            flex-direction: column;
            gap: 12px;
          }

          .order-admin-id {
            font-size: 22px;
          }

          .order-admin-meta,
          .order-admin-item {
            font-size: 12px;
            line-height: 1.55;
            overflow-wrap: anywhere;
          }

          .order-status-select {
            width: 100%;
            min-height: 40px;
          }
        }
      `}</style>

      <AdminLayout>
        <div>
          <div className="admin-page-header">
            <p className="admin-eyebrow">Commerce</p>
            <h1 className="admin-title">Orders</h1>
          </div>

          <div className="admin-stat-grid">
            <div className="admin-stat-card">
              <span className="admin-stat-label">Orders</span>
              <span className="admin-stat-value">{loading ? "-" : orders.length}</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-label">Pending</span>
              <span className="admin-stat-value">{loading ? "-" : stats.pending}</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-label">Sales</span>
              <span className="admin-stat-value">{loading ? "-" : formatCurrency(stats.sales)}</span>
            </div>
          </div>

          {error && (
            <div className="order-error">
              Orders could not load: {error}
            </div>
          )}

          {!loading && !error && orders.length === 0 && (
            <div className="order-empty">No orders yet.</div>
          )}

          {orders.map((order) => (
            <div className="order-admin-card" key={order._id}>
              <div className="order-admin-top">
                <div>
                  <Link className="order-admin-id" to={`/admin/orders/${order._id}`}>
                    Order #{order._id.slice(-6).toUpperCase()}
                  </Link>
                  <div className="order-admin-meta">
                    {order.customerInfo?.firstName} {order.customerInfo?.lastName} | {order.customerInfo?.email}
                  </div>
                  <div className="order-admin-meta">{new Date(order.createdAt).toLocaleString()}</div>
                </div>
                <div>
                  <select
                    className="order-status-select"
                    value={order.orderStatus}
                    onChange={(e) => updateStatus(order, e.target.value)}
                  >
                    <option value="received">Received</option>
                    <option value="preparing">Preparing</option>
                    <option value="fulfilled">Fulfilled</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <div className="order-admin-id">
                    {formatCurrency((Number(order.subtotal) || 0) + (Number(order.shipping) || 0))}
                  </div>
                </div>
              </div>
              {(order.items || []).map((item, index) => (
                <div className="order-admin-item" key={`${item.productId}-${index}`}>
                  {item.name} ({item.variantLabel || "Standard"}) x {item.quantity}
                </div>
              ))}
            </div>
          ))}
        </div>
      </AdminLayout>
    </>
  );
}

export default AdminOrdersPage;
