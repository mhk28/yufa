import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useCustomerAuth } from "../context/CustomerAuthContext";

function StoreLayout({ children }) {
  const { itemCount } = useCart();
  const { isAuthenticated } = useCustomerAuth();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Jost:wght@300;400;500&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
        }

        html,
        body,
        #root {
          width: 100%;
          max-width: none;
          min-height: 100vh;
          margin: 0;
          padding: 0;
          border: none;
          text-align: initial;
        }

        body {
          margin: 0;
          background: #fbf8f4;
          color: #1a0a2e;
          overflow-x: hidden;
        }

        ::selection {
          background: #2d1155;
          color: #e8c96e;
        }

        .store-shell {
          width: 100%;
          min-width: 0;
          min-height: 100vh;
          background:
            linear-gradient(180deg, #fbf8f4 0%, #fffdf9 42%, #f8f1ea 100%);
          font-family: 'Jost', sans-serif;
        }

        .store-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 0 clamp(22px, 5vw, 72px);
          background: rgba(251, 248, 244, 0.9);
          border-bottom: 1px solid rgba(201, 168, 76, 0.16);
          backdrop-filter: blur(18px);
        }

        .store-brand {
          display: inline-flex;
          align-items: center;
          text-decoration: none;
          color: #1a0a2e;
        }

        .store-logo {
          width: 54px;
          height: auto;
          display: block;
        }

        .store-brand-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          font-weight: 500;
          letter-spacing: 0.04em;
        }

        .store-links {
          display: flex;
          align-items: center;
          gap: clamp(18px, 3vw, 38px);
        }

        .store-link {
          position: relative;
          text-decoration: none;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(45, 17, 85, 0.58);
          transition: color 0.2s ease;
          white-space: nowrap;
        }

        .store-link::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: -8px;
          height: 1px;
          background: #c9a84c;
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 0.2s ease;
        }

        .store-link:hover,
        .store-link.active {
          color: #2d1155;
        }

        .store-link:hover::after,
        .store-link.active::after {
          transform: scaleX(1);
        }

        .cart-button {
          position: relative;
          width: 42px;
          height: 42px;
          border: 1px solid rgba(201, 168, 76, 0.28);
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #2d1155;
          background: rgba(255, 255, 255, 0.58);
          text-decoration: none;
        }

        .cart-count {
          position: absolute;
          top: -7px;
          right: -7px;
          min-width: 19px;
          height: 19px;
          padding: 0 5px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #2d1155;
          color: #e8c96e;
          border: 1px solid rgba(201, 168, 76, 0.45);
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0;
        }

        .store-main {
          min-height: 70vh;
        }

        .store-section {
          padding: clamp(64px, 9vw, 118px) clamp(22px, 5vw, 72px);
        }

        .store-container {
          width: min(1180px, 100%);
          margin: 0 auto;
        }

        .store-footer {
          padding: 64px clamp(22px, 5vw, 72px) 34px;
          background: #1a0a2e;
          color: rgba(255, 255, 255, 0.72);
        }

        .footer-grid {
          width: min(1180px, 100%);
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.4fr repeat(3, 1fr);
          gap: 34px;
          padding-bottom: 42px;
          border-bottom: 1px solid rgba(201, 168, 76, 0.18);
        }

        .footer-brand {
          font-family: 'Cormorant Garamond', serif;
          font-size: 30px;
          color: #e8c96e;
          margin: 0 0 14px;
        }

        .footer-copy,
        .footer-link,
        .footer-note {
          font-size: 13px;
          font-weight: 300;
          line-height: 1.8;
        }

        .footer-copy {
          max-width: 360px;
        }

        .footer-heading {
          font-size: 10px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #c9a84c;
          margin: 0 0 14px;
        }

        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .footer-link {
          color: rgba(255, 255, 255, 0.68);
          text-decoration: none;
        }

        .footer-socials {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 14px;
        }

        .footer-social {
          width: 42px;
          height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(201, 168, 76, 0.28);
          border-radius: 50%;
          color: #e8c96e;
          text-decoration: none;
          transition: transform 0.2s ease, background 0.2s ease;
        }

        .footer-social:hover {
          transform: translateY(-2px);
          background: rgba(201, 168, 76, 0.08);
        }

        .footer-bottom {
          width: min(1180px, 100%);
          margin: 26px auto 0;
          display: flex;
          justify-content: space-between;
          gap: 20px;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.32);
        }

        @media (max-width: 860px) {
          .store-nav {
            height: auto;
            min-height: 76px;
            align-items: center;
            flex-direction: row;
            flex-wrap: wrap;
            padding-top: 16px;
            padding-bottom: 16px;
          }

          .store-links {
            width: 100%;
            justify-content: center;
            gap: 14px;
          }

          .store-brand-text {
            font-size: 21px;
          }

          .footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 580px) {
          .store-nav {
            justify-content: center;
            padding-left: 18px;
            padding-right: 18px;
          }

          .store-brand {
            width: 100%;
            justify-content: center;
          }

          .store-logo {
            width: 46px;
          }

          .store-links {
            flex-wrap: wrap;
            justify-content: center;
          }

          .store-link {
            font-size: 10px;
            letter-spacing: 0.16em;
          }

          .cart-button {
            width: 38px;
            height: 38px;
          }

          .footer-grid,
          .footer-bottom {
            grid-template-columns: 1fr;
            flex-direction: column;
          }
        }
      `}</style>

      <div className="store-shell">
        <nav className="store-nav">
          <Link className="store-brand" to="/">
            <img className="store-logo" src="/images/yufa-logo.png" alt="Yufa Collections" />
            {/* <span className="store-brand-text">YUFA COLLECTIONS</span> */}
          </Link>

          <div className="store-links">
            <NavLink className="store-link" to="/collections">
              Collections
            </NavLink>
            <NavLink className="store-link" to="/about">
              About
            </NavLink>
            <NavLink className="store-link" to="/contact">
              Contact
            </NavLink>
            <NavLink className="store-link" to={isAuthenticated ? "/account" : "/login"}>
              {isAuthenticated ? "Account" : "Login"}
            </NavLink>
            <Link className="cart-button" to="/cart" title="Cart">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
              </svg>
              {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
            </Link>
          </div>
        </nav>

        <main className="store-main">{children}</main>

        <footer className="store-footer">
          <div className="footer-grid">
            <div>
              <h2 className="footer-brand">Yufa Collections</h2>
              <p className="footer-copy">
                Modest essentials shaped with quiet refinement, thoughtful textures, and a graceful everyday rhythm.
              </p>
            </div>

            <div>
              <p className="footer-heading">Browse</p>
              <div className="footer-links">
                <Link className="footer-link" to="/collections">Collections</Link>
                <Link className="footer-link" to="/collections/scarves-and-hijabs">Scarves & Hijabs</Link>
                <Link className="footer-link" to="/collections/abayas-and-dresses">Abayas and Dresses</Link>
              </div>
            </div>

            <div>
              <p className="footer-heading">Brand</p>
              <div className="footer-links">
                <Link className="footer-link" to="/about">Our Story</Link>
                <Link className="footer-link" to="/contact">Contact</Link>
              </div>
            </div>

            <div>
              <p className="footer-heading">Connect</p>
              <div className="footer-links">
                <a className="footer-link" href="mailto:admin@yufacollections.com">admin@yufacollections.com</a>
                <a className="footer-link" href="tel:+6588793249">+65 8879 3249</a>
              </div>
              <div className="footer-socials" aria-label="Social links">
                <a className="footer-social" href="https://www.instagram.com/yufa.collections/" target="_blank" rel="noreferrer" title="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                <a className="footer-social" href="https://www.tiktok.com/@yufa.collections?lang=en" target="_blank" rel="noreferrer" title="TikTok">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M15.5 3c.5 2.9 2.1 4.5 5 4.8v3.4a8.1 8.1 0 0 1-5-1.6v6.1c0 3.1-2.2 5.3-5.4 5.3A5.1 5.1 0 0 1 5 15.9c0-3 2.3-5.2 5.4-5.2.4 0 .7 0 1.1.1v3.5a3 3 0 0 0-1.1-.2c-1.1 0-1.9.7-1.9 1.8 0 1 .8 1.8 1.8 1.8s1.8-.7 1.8-2V3h3.4Z" />
                  </svg>
                </a>
                <a className="footer-social" href="https://www.facebook.com/profile.php?id=100091649473975" target="_blank" rel="noreferrer" title="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M14 8.5V7c0-.7.5-1 1.2-1H17V3h-2.6C11.8 3 10 4.6 10 7v1.5H7.8V12H10v9h4v-9h2.7l.5-3.5H14Z" />
                  </svg>
                </a>
                <a className="footer-social" href="tel:+6588793249" title="Phone">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
                  </svg>
                </a>
                <a className="footer-social" href="mailto:admin@yufacollections.com" title="Email">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
                    <path d="m22 6-10 7L2 6" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <span>Copyright 2026 Yufa Collections</span>
            <span>Editorial modest luxury</span>
          </div>
        </footer>
      </div>
    </>
  );
}

export default StoreLayout;
