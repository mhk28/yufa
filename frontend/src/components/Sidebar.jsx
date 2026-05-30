import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const navItems = [
    {
      to: "/admin/dashboard",
      label: "Dashboard",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 13h8V3H3v10z" />
          <path d="M13 21h8V3h-8v18z" />
          <path d="M3 21h8v-6H3v6z" />
        </svg>
      ),
    },
    {
      to: "/admin/products",
      label: "Products",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="7" height="7" rx="1" />
          <rect x="15" y="3" width="7" height="7" rx="1" />
          <rect x="2" y="14" width="7" height="7" rx="1" />
          <rect x="15" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
    {
      to: "/admin/categories",
      label: "Categories",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 6h16" />
          <path d="M4 12h16" />
          <path d="M4 18h16" />
          <circle cx="7" cy="6" r="1" />
          <circle cx="7" cy="12" r="1" />
          <circle cx="7" cy="18" r="1" />
        </svg>
      ),
    },
    {
      to: "/admin/showcase",
      label: "Showcase",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m8 13 2.5-2.5L14 14l2-2 3 3" />
          <circle cx="8" cy="9" r="1" />
        </svg>
      ),
    },
    {
      to: "/admin/orders",
      label: "Orders",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2l1.5 4h9L18 2" />
          <path d="M4 6h16l-1.5 14h-13L4 6z" />
          <path d="M9 11h6" />
        </svg>
      ),
    },
    {
      to: "/admin/customers",
      label: "Customers",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
  ];

  const isActive = (to) => {
    if (to === "/admin/dashboard") {
      return location.pathname === "/admin" || location.pathname === "/admin/dashboard";
    }

    if (to === "/admin/products") {
      return location.pathname === "/admin/products" || location.pathname.startsWith("/admin/edit-product");
    }

    return location.pathname === to;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Jost:wght@300;400;500&display=swap');

        .yufa-sidebar {
          width: 260px;
          min-height: 100vh;
          background: linear-gradient(175deg, #1a0a2e 0%, #2d1155 50%, #1a0a2e 100%);
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
          flex-shrink: 0;
        }

        .yufa-sidebar::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background:
            radial-gradient(ellipse at 20% 20%, rgba(190, 150, 80, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(120, 60, 180, 0.15) 0%, transparent 50%);
          pointer-events: none;
        }

        .sidebar-ornament {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, #c9a84c, #e8c96e, #c9a84c, transparent);
        }

        .sidebar-logo-area {
          padding: 36px 28px 28px;
          border-bottom: 1px solid rgba(201, 168, 76, 0.2);
          position: relative;
        }

        .sidebar-logo-img {
          width: min(120px, 70%);
          height: auto;
          display: block;
          margin: 0 auto;
          filter: drop-shadow(0 2px 12px rgba(201, 168, 76, 0.3));
        }

        .sidebar-subtitle {
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(201, 168, 76, 0.6);
          text-align: center;
          margin-top: 12px;
        }

        .sidebar-nav {
          padding: 32px 20px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }

        .nav-section-label {
          font-family: 'Jost', sans-serif;
          font-size: 9px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(201, 168, 76, 0.4);
          padding: 0 12px;
          margin-bottom: 8px;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 16px;
          border-radius: 8px;
          text-decoration: none;
          font-family: 'Jost', sans-serif;
          font-weight: 400;
          font-size: 13.5px;
          letter-spacing: 0.05em;
          color: rgba(255, 255, 255, 0.65);
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
        }

        .sidebar-link::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(201, 168, 76, 0.12), transparent);
          opacity: 0;
          transition: opacity 0.25s ease;
          border-radius: 8px;
        }

        .sidebar-link:hover {
          color: rgba(255, 255, 255, 0.95);
        }

        .sidebar-link:hover::before {
          opacity: 1;
        }

        .sidebar-link.active {
          color: #e8c96e;
          background: rgba(201, 168, 76, 0.1);
          border: 1px solid rgba(201, 168, 76, 0.25);
        }

        .sidebar-link.active::after {
          content: '';
          position: absolute;
          left: 0; top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 60%;
          background: linear-gradient(180deg, #c9a84c, #e8c96e);
          border-radius: 0 2px 2px 0;
        }

        .sidebar-link svg {
          flex-shrink: 0;
          opacity: 0.7;
        }

        .sidebar-link.active svg {
          opacity: 1;
        }

        .sidebar-footer {
          padding: 20px 28px;
          border-top: 1px solid rgba(201, 168, 76, 0.15);
        }

        .sidebar-footer-text {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.15em;
          color: rgba(255, 255, 255, 0.2);
          text-align: center;
        }

        .butterfly-deco {
          position: absolute;
          bottom: 80px;
          right: 20px;
          opacity: 0.04;
          font-size: 80px;
          line-height: 1;
          pointer-events: none;
        }

        @media (max-width: 840px) {
          .yufa-sidebar {
            width: 100%;
            min-height: auto;
            height: auto;
            position: relative;
          }

          .sidebar-logo-area {
            padding: 22px 18px 16px;
          }

          .sidebar-logo-img {
            width: 82px;
          }

          .sidebar-nav {
            padding: 14px;
            flex-direction: row;
            gap: 8px;
            overflow-x: auto;
          }

          .nav-section-label,
          .sidebar-footer,
          .butterfly-deco {
            display: none;
          }

          .sidebar-link {
            flex: 0 0 auto;
            min-width: 132px;
            justify-content: center;
            padding: 11px 13px;
          }
        }

        @media (max-width: 520px) {
          .sidebar-logo-area {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 14px;
          }

          .sidebar-subtitle {
            margin-top: 0;
            text-align: left;
          }

          .sidebar-link {
            min-width: 116px;
            font-size: 12px;
          }
        }
      `}</style>

      <div className="yufa-sidebar">
        <div className="sidebar-ornament" />

        <div className="sidebar-logo-area">
                  <img
                      src="/images/yufa-logo.png"
                      alt="Yufa Collections"
                      className="sidebar-logo-img"
                  />
          <p className="sidebar-subtitle">Admin Portal</p>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-section-label">Management</p>
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`sidebar-link ${isActive(item.to) ? "active" : ""}`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="butterfly-deco">🦋</div>

        <div className="sidebar-footer">
          <p className="sidebar-footer-text">© 2026 Yufa Collections</p>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
