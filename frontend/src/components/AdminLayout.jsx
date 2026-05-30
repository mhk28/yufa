import Sidebar from "./Sidebar";

function AdminLayout({ children }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Jost:wght@300;400;500&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html, body, #root {
          margin: 0;
          padding: 0;
          width: 100%;
          min-height: 100vh;
          background: #f8f5f2;
          font-family: 'Jost', sans-serif;
        }

        .admin-layout {
          display: flex;
          min-height: 100vh;
        }

        .admin-main {
          flex: 1;
          background: #f8f5f2;
          min-height: 100vh;
          overflow-y: auto;
        }

        .admin-topbar {
          background: #fff;
          border-bottom: 1px solid rgba(201, 168, 76, 0.2);
          padding: 0 36px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .topbar-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-weight: 500;
          color: #2d1155;
          letter-spacing: 0.05em;
        }

        .topbar-date {
          font-family: 'Jost', sans-serif;
          font-size: 12px;
          letter-spacing: 0.1em;
          color: rgba(45, 17, 85, 0.4);
        }

        .admin-content {
          padding: 40px 36px;
        }

        @media (max-width: 840px) {
          .admin-layout {
            flex-direction: column;
          }

          .admin-content {
            padding: 28px 18px;
          }
        }

        @media (max-width: 520px) {
          .admin-content {
            padding: 22px 14px;
          }
        }
      `}</style>

      <div className="admin-layout">
        <Sidebar />
        <div className="admin-main">
          {/* <div className="admin-topbar">
            <span className="topbar-title">Yufa Collections</span>
            <span className="topbar-date">
              {new Date().toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div> */}
          <div className="admin-content">{children}</div>
        </div>
      </div>
    </>
  );
}

export default AdminLayout;
