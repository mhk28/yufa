import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { API_BASE_URL, formatCurrency } from "../utils/storefront";

function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const [customersResponse, ordersResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/users/customers`, {
            headers: { Authorization: token },
          }),
          fetch(`${API_BASE_URL}/orders`, {
            headers: { Authorization: token },
          }),
        ]);

        const customersData = await customersResponse.json();
        const ordersData = await ordersResponse.json();

        setCustomers(Array.isArray(customersData) ? customersData : []);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const customerStats = useMemo(() => {
    const statsByCustomer = {};

    orders.forEach((order) => {
      const customerId = order.customer?._id || order.customer;

      if (!customerId) {
        return;
      }

      if (!statsByCustomer[customerId]) {
        statsByCustomer[customerId] = {
          orders: 0,
          spend: 0,
          lastOrder: null,
        };
      }

      statsByCustomer[customerId].orders += 1;
      statsByCustomer[customerId].spend += (order.subtotal || 0) + (order.shipping || 0);

      const orderDate = new Date(order.createdAt);
      if (!statsByCustomer[customerId].lastOrder || orderDate > statsByCustomer[customerId].lastOrder) {
        statsByCustomer[customerId].lastOrder = orderDate;
      }
    });

    return statsByCustomer;
  }, [orders]);

  const totalSpend = useMemo(
    () => orders.reduce((total, order) => total + (order.subtotal || 0) + (order.shipping || 0), 0),
    [orders]
  );

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

        .customer-stat-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(160px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .customer-stat-card,
        .customer-card,
        .guest-panel {
          background: #fff;
          border: 1px solid rgba(201, 168, 76, 0.16);
          border-radius: 8px;
        }

        .customer-stat-card {
          padding: 22px;
          text-align: left;
        }

        .customer-stat-label {
          display: block;
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(45, 17, 85, 0.45);
          margin-bottom: 12px;
        }

        .customer-stat-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 36px;
          color: #2d1155;
        }

        .customer-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .customer-card,
        .guest-panel {
          padding: 22px;
          text-align: left;
        }

        .customer-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 16px;
        }

        .customer-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          font-weight: 500;
          color: #1a0a2e;
          margin: 0 0 5px;
        }

        .customer-email,
        .customer-meta,
        .guest-copy {
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          color: rgba(45, 17, 85, 0.62);
          line-height: 1.7;
        }

        .customer-pill {
          padding: 7px 10px;
          border-radius: 999px;
          background: rgba(201, 168, 76, 0.12);
          color: #9c7a1e;
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .customer-metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          padding-top: 16px;
          border-top: 1px solid rgba(201, 168, 76, 0.12);
        }

        .metric-label {
          display: block;
          margin-bottom: 5px;
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(45, 17, 85, 0.42);
        }

        .metric-value {
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          color: #2d1155;
        }

        .guest-panel {
          margin-top: 16px;
        }

        @media (max-width: 900px) {
          .customer-stat-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 9px;
          }

          .customer-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
          }

          .customer-stat-card,
          .customer-card,
          .guest-panel {
            padding: 14px;
          }

          .customer-stat-label {
            font-size: 8px;
            letter-spacing: 0.1em;
            margin-bottom: 8px;
          }

          .customer-stat-value {
            font-size: 24px;
            overflow-wrap: anywhere;
          }

          .customer-name {
            font-size: 21px;
            line-height: 1.05;
          }

          .customer-email,
          .customer-meta,
          .guest-copy {
            font-size: 11px;
            line-height: 1.45;
            overflow-wrap: anywhere;
          }
        }

        @media (max-width: 560px) {
          .customer-card-top,
          .customer-metrics {
            grid-template-columns: 1fr;
            flex-direction: column;
            gap: 10px;
          }

          .customer-pill {
            align-self: flex-start;
            font-size: 8px;
            padding: 5px 8px;
          }

          .metric-label {
            font-size: 8px;
            letter-spacing: 0.08em;
          }

          .metric-value {
            font-size: 11px;
            overflow-wrap: anywhere;
          }
        }

        @media (max-width: 360px) {
          .customer-grid,
          .customer-stat-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <AdminLayout>
        <div>
          <div className="admin-page-header">
            <p className="admin-eyebrow">Commerce</p>
            <h1 className="admin-title">Customers</h1>
          </div>

          <div className="customer-stat-grid">
            <div className="customer-stat-card">
              <span className="customer-stat-label">Customers</span>
              <span className="customer-stat-value">{loading ? "-" : customers.length}</span>
            </div>
            <div className="customer-stat-card">
              <span className="customer-stat-label">Customer Orders</span>
              <span className="customer-stat-value">{loading ? "-" : orders.filter((order) => order.customer).length}</span>
            </div>
            <div className="customer-stat-card">
              <span className="customer-stat-label">Total Spend</span>
              <span className="customer-stat-value">{loading ? "-" : formatCurrency(totalSpend)}</span>
            </div>
          </div>

          <div className="customer-grid">
            {customers.map((customer) => {
              const stats = customerStats[customer._id] || {};

              return (
                <div className="customer-card" key={customer._id}>
                  <div className="customer-card-top">
                    <div>
                      <h2 className="customer-name">{customer.name}</h2>
                      <div className="customer-email">{customer.email}</div>
                      <div className="customer-meta">
                        Joined {new Date(customer.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <span className="customer-pill">Customer</span>
                  </div>

                  <div className="customer-metrics">
                    <div>
                      <span className="metric-label">Orders</span>
                      <span className="metric-value">{stats.orders || 0}</span>
                    </div>
                    <div>
                      <span className="metric-label">Spend</span>
                      <span className="metric-value">{formatCurrency(stats.spend || 0)}</span>
                    </div>
                    <div>
                      <span className="metric-label">Last Order</span>
                      <span className="metric-value">
                        {stats.lastOrder ? stats.lastOrder.toLocaleDateString() : "None"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {!loading && customers.length === 0 && (
            <div className="guest-panel">
              <p className="guest-copy">No customer accounts yet. Guest checkout orders will still appear in Orders.</p>
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
}

export default AdminCustomersPage;
