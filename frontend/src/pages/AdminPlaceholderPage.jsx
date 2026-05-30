import AdminLayout from "../components/AdminLayout";

function AdminPlaceholderPage({ eyebrow, title, description, items = [] }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Jost:wght@300;400;500&display=swap');

        .placeholder-wrap {
          min-height: calc(100vh - 80px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .placeholder-panel {
          width: min(720px, 100%);
          background: #fff;
          border: 1px solid rgba(201, 168, 76, 0.16);
          border-radius: 8px;
          padding: 48px;
          text-align: left;
          position: relative;
          overflow: hidden;
        }

        .placeholder-panel::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #2d1155, #c9a84c, #e8c96e);
        }

        .placeholder-eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #c9a84c;
          margin-bottom: 12px;
        }

        .placeholder-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 38px;
          font-weight: 400;
          line-height: 1;
          color: #1a0a2e;
          margin: 0 0 14px;
        }

        .placeholder-description {
          font-family: 'Jost', sans-serif;
          font-size: 14px;
          line-height: 1.8;
          color: rgba(45, 17, 85, 0.52);
          margin-bottom: 24px;
        }

        .placeholder-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
          list-style: none;
        }

        .placeholder-item {
          border: 1px solid rgba(201, 168, 76, 0.16);
          border-radius: 6px;
          padding: 14px;
          font-family: 'Jost', sans-serif;
          font-size: 12px;
          color: rgba(45, 17, 85, 0.62);
          background: rgba(201, 168, 76, 0.035);
        }
      `}</style>

      <AdminLayout>
        <div className="placeholder-wrap">
          <div className="placeholder-panel">
            <p className="placeholder-eyebrow">{eyebrow}</p>
            <h1 className="placeholder-title">{title}</h1>
            <p className="placeholder-description">{description}</p>
            <ul className="placeholder-list">
              {items.map((item) => (
                <li className="placeholder-item" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}

export default AdminPlaceholderPage;
