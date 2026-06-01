import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { API_BASE_URL, formatCurrency } from "../utils/storefront";

function AdminOrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const getShippingMethodLabel = (method = "") =>
    method === "pickup" ? "Self-collection / Pickup" : "Local delivery";

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
        headers: { Authorization: token },
      });
      const data = await response.json();
      setOrder(response.ok ? data : null);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const updateStatus = async (orderStatus) => {
    const token = localStorage.getItem("token");
    await fetch(`${API_BASE_URL}/orders/${id}/status`, {
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
    fetchOrder();
  };

  return (
    <>
      <style>{`
        .order-detail-header {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 28px;
          padding-bottom: 22px;
          border-bottom: 1px solid rgba(201, 168, 76, 0.2);
          text-align: left;
        }

        .order-detail-back {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(45, 17, 85, 0.5);
          text-decoration: none;
        }

        .order-detail-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 38px;
          font-weight: 400;
          color: #1a0a2e;
          margin: 8px 0 0;
        }

        .order-detail-grid {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 20px;
          align-items: start;
        }

        .order-detail-panel {
          padding: 24px;
          background: #fff;
          border: 1px solid rgba(201, 168, 76, 0.16);
          border-radius: 8px;
          text-align: left;
        }

        .order-detail-panel + .order-detail-panel {
          margin-top: 16px;
        }

        .panel-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          color: #1a0a2e;
          margin: 0 0 16px;
        }

        .detail-line,
        .order-item-row {
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          line-height: 1.8;
          color: rgba(45, 17, 85, 0.64);
        }

        .order-item-row {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          padding: 12px 0;
          border-top: 1px solid rgba(201, 168, 76, 0.12);
        }

        .status-select {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid rgba(201, 168, 76, 0.24);
          background: #fdfcfb;
          color: #1a0a2e;
          font-family: 'Jost', sans-serif;
        }

        .total-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 34px;
          color: #2d1155;
        }

        @media (max-width: 860px) {
          .order-detail-grid,
          .order-detail-header {
            grid-template-columns: 1fr;
            flex-direction: column;
          }
        }
      `}</style>

      <AdminLayout>
        {loading ? (
          <div className="order-detail-panel">Loading order...</div>
        ) : !order ? (
          <div className="order-detail-panel">Order not found.</div>
        ) : (
          <div>
            <div className="order-detail-header">
              <div>
                <Link className="order-detail-back" to="/admin/orders">Back to orders</Link>
                <h1 className="order-detail-title">Order #{order._id.slice(-6).toUpperCase()}</h1>
              </div>
              <div className="total-value">{formatCurrency((order.subtotal || 0) + (order.shipping || 0))}</div>
            </div>

            <div className="order-detail-grid">
              <div>
                <div className="order-detail-panel">
                  <h2 className="panel-heading">Purchased Items</h2>
                  {order.items.map((item, index) => (
                    <div className="order-item-row" key={`${item.productId}-${index}`}>
                      <span>{item.name} {item.variantLabel ? `(${item.variantLabel})` : ""} x {item.quantity}</span>
                      <span>{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="order-detail-panel">
                  <h2 className="panel-heading">Customer</h2>
                  <p className="detail-line">{order.customerInfo?.firstName} {order.customerInfo?.lastName}</p>
                  <p className="detail-line">{order.customerInfo?.email}</p>
                  <p className="detail-line">{order.customerInfo?.phone}</p>
                  <p className="detail-line">{order.customerInfo?.address}</p>
                </div>
              </div>

              <aside className="order-detail-panel">
                <h2 className="panel-heading">Operations</h2>
                <p className="detail-line">Payment: {order.paymentStatus}</p>
                <p className="detail-line">Method: {order.paymentMethod}</p>
                <p className="detail-line">Shipping: {getShippingMethodLabel(order.shippingMethod)} ({order.shipping ? formatCurrency(order.shipping) : "Free"})</p>
                <label className="detail-line">
                  Fulfilment status
                  <select className="status-select" value={order.orderStatus} onChange={(e) => updateStatus(e.target.value)}>
                    <option value="received">Received</option>
                    <option value="preparing">Preparing</option>
                    <option value="fulfilled">Fulfilled</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </label>
              </aside>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
}

export default AdminOrderDetailPage;
