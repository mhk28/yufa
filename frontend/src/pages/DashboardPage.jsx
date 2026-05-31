import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import {
  CATEGORY_OPTIONS,
  categoryMatches,
  getProductCollectionLabel,
} from "../data/catalogueOptions";
import { API_BASE_URL, formatCurrency } from "../utils/storefront";

function DashboardPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const [productsResponse, ordersResponse, customersResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/products`),
          fetch(`${API_BASE_URL}/orders`, {
            headers: { Authorization: token },
          }),
          fetch(`${API_BASE_URL}/users/customers`, {
            headers: { Authorization: token },
          }),
        ]);

        const productsData = await productsResponse.json();
        const ordersData = await ordersResponse.json();
        const customersData = await customersResponse.json();

        setProducts(Array.isArray(productsData) ? productsData : []);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setCustomers(Array.isArray(customersData) ? customersData : []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const stats = useMemo(() => {
    const published = products.filter((product) => product.isPublished).length;
    const sales = orders.reduce((total, order) => total + (order.subtotal || 0) + (order.shipping || 0), 0);
    const openOrders = orders.filter((order) => ["received", "preparing"].includes(order.orderStatus)).length;

    return {
      total: products.length,
      published,
      hidden: products.length - published,
      orders: orders.length,
      customers: customers.length,
      openOrders,
      sales,
    };
  }, [customers, orders, products]);

  const recentProducts = useMemo(
    () =>
      [...products]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 5),
    [products]
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Jost:wght@300;400;500&display=swap');

        .dashboard-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 30px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(201, 168, 76, 0.2);
          text-align: left;
        }

        .dashboard-eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #c9a84c;
          margin-bottom: 10px;
        }

        .dashboard-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 38px;
          font-weight: 400;
          color: #1a0a2e;
          line-height: 1;
          margin: 0 0 10px;
        }

        .dashboard-subtitle {
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          color: rgba(45, 17, 85, 0.45);
        }

        .dashboard-action {
          padding: 12px 22px;
          border: none;
          border-radius: 6px;
          background: linear-gradient(135deg, #2d1155, #4a1d8a);
          color: #e8c96e;
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(150px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card,
        .panel {
          background: #fff;
          border: 1px solid rgba(201, 168, 76, 0.16);
          border-radius: 8px;
        }

        .stat-card {
          padding: 22px;
          text-align: left;
        }

        .stat-label {
          display: block;
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(45, 17, 85, 0.45);
          margin-bottom: 12px;
        }

        .stat-value {
          display: block;
          font-family: 'Cormorant Garamond', serif;
          font-size: 42px;
          line-height: 1;
          color: #2d1155;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 20px;
        }

        .panel {
          padding: 24px;
          text-align: left;
        }

        .panel-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 25px;
          font-weight: 500;
          color: #1a0a2e;
          margin: 0 0 18px;
        }

        .category-line,
        .recent-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 13px 0;
          border-top: 1px solid rgba(201, 168, 76, 0.12);
        }

        .category-name,
        .recent-name {
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          color: rgba(45, 17, 85, 0.72);
        }

        .category-count,
        .recent-status {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #c9a84c;
          white-space: nowrap;
        }

        .recent-meta {
          display: block;
          margin-top: 4px;
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          color: rgba(45, 17, 85, 0.38);
        }

        .empty-panel {
          padding-top: 8px;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 18px;
          color: rgba(45, 17, 85, 0.35);
        }

        @media (max-width: 980px) {
          .stats-grid,
          .dashboard-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 680px) {
          .dashboard-header {
            align-items: flex-start;
            flex-direction: column;
            gap: 14px;
            margin-bottom: 20px;
          }

          .dashboard-title {
            font-size: 32px;
          }

          .dashboard-action {
            width: 100%;
            min-height: 42px;
          }

          .stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
          }

          .stat-card {
            padding: 14px;
          }

          .stat-label {
            font-size: 8px;
            letter-spacing: 0.12em;
            margin-bottom: 8px;
          }

          .stat-value {
            font-size: 30px;
          }

          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .panel {
            padding: 16px;
          }

          .panel-title {
            font-size: 22px;
          }
        }
      `}</style>

      <AdminLayout>
        <div>
          <div className="dashboard-header">
            <div>
              <p className="dashboard-eyebrow">Overview</p>
              <h1 className="dashboard-title">Dashboard</h1>
              <p className="dashboard-subtitle">A quick read on catalogue health and publishing progress.</p>
            </div>
            <button className="dashboard-action" onClick={() => navigate("/admin/add-product")}>
              Add Product
            </button>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">Products</span>
              <span className="stat-value">{loading ? "-" : stats.total}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Published</span>
              <span className="stat-value">{loading ? "-" : stats.published}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Hidden</span>
              <span className="stat-value">{loading ? "-" : stats.hidden}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Orders</span>
              <span className="stat-value">{loading ? "-" : stats.orders}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Customers</span>
              <span className="stat-value">{loading ? "-" : stats.customers}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Open Orders</span>
              <span className="stat-value">{loading ? "-" : stats.openOrders}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Sales</span>
              <span className="stat-value">{loading ? "-" : formatCurrency(stats.sales)}</span>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="panel">
              <h2 className="panel-title">Collection Mix</h2>
              {CATEGORY_OPTIONS.map((category) => {
                const count = products.filter((product) => categoryMatches(product, category)).length;

                return (
                  <div className="category-line" key={category.name}>
                    <span className="category-name">{category.name}</span>
                    <span className="category-count">
                      {loading ? "-" : count} item{count !== 1 ? "s" : ""}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="panel">
              <h2 className="panel-title">Recent Products</h2>
              {recentProducts.length === 0 ? (
                <p className="empty-panel">No recent products yet</p>
              ) : (
                recentProducts.map((product) => (
                  <div className="recent-row" key={product._id}>
                    <div>
                      <span className="recent-name">{product.name}</span>
                      <span className="recent-meta">{getProductCollectionLabel(product) || "Uncategorized"}</span>
                    </div>
                    <span className="recent-status">{product.isPublished ? "Published" : "Hidden"}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}

export default DashboardPage;
