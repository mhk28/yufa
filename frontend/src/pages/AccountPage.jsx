import { Link, useNavigate } from "react-router-dom";
import StoreLayout from "../components/StoreLayout";
import { useCustomerAuth } from "../context/CustomerAuthContext";

function AccountPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useCustomerAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <style>{`
        .account-page {
          padding: clamp(54px, 8vw, 104px) clamp(22px, 5vw, 72px);
        }

        .account-shell {
          width: min(1080px, 100%);
          margin: 0 auto;
          text-align: left;
        }

        .account-hero {
          margin-bottom: 26px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(201, 168, 76, 0.18);
        }

        .account-eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #c9a84c;
          margin: 0 0 12px;
        }

        .account-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(46px, 7vw, 74px);
          font-weight: 300;
          line-height: 0.95;
          margin: 0 0 18px;
          color: #1a0a2e;
        }

        .account-copy {
          font-family: 'Jost', sans-serif;
          font-size: 14px;
          line-height: 1.8;
          color: rgba(45, 17, 85, 0.58);
        }

        .account-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.75fr);
          gap: 18px;
          align-items: stretch;
        }

        .account-card {
          background: #fff;
          border: 1px solid rgba(201, 168, 76, 0.16);
          padding: 30px;
        }

        .account-card-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          font-weight: 400;
          color: #1a0a2e;
          margin: 0 0 16px;
        }

        .profile-lines {
          display: grid;
          gap: 12px;
        }

        .profile-line {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          padding: 12px 0;
          border-top: 1px solid rgba(201, 168, 76, 0.12);
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          color: rgba(45, 17, 85, 0.62);
        }

        .profile-line strong {
          color: #2d1155;
          font-weight: 500;
        }

        .account-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 26px;
        }

        .account-link,
        .account-button {
          min-height: 46px;
          padding: 0 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          text-decoration: none;
        }

        .account-link {
          background: #2d1155;
          color: #e8c96e;
        }

        .account-button {
          border: 1px solid rgba(45, 17, 85, 0.18);
          color: #2d1155;
          background: transparent;
          cursor: pointer;
        }

        .account-support {
          display: grid;
          gap: 10px;
          margin-top: 18px;
        }

        .support-link {
          min-height: 42px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #2d1155;
          text-decoration: none;
          font-family: 'Jost', sans-serif;
          font-size: 13px;
        }

        .support-link svg {
          color: #c9a84c;
          flex-shrink: 0;
        }

        @media (max-width: 780px) {
          .account-grid {
            grid-template-columns: 1fr;
          }

          .account-card {
            padding: 24px 20px;
          }

          .profile-line {
            flex-direction: column;
            gap: 4px;
          }
        }
      `}</style>

      <StoreLayout>
        <section className="account-page">
          <div className="account-shell">
            {isAuthenticated ? (
              <>
                <div className="account-hero">
                  <p className="account-eyebrow">Customer Account</p>
                  <h1 className="account-title">Hello, {user?.name}</h1>
                  <p className="account-copy">
                    Keep track of your Yufa orders, continue browsing, and reach us quickly if you need help with a piece.
                  </p>
                </div>

                <div className="account-grid">
                  <div className="account-card">
                    <h2 className="account-card-title">Profile</h2>
                    <div className="profile-lines">
                      <div className="profile-line">
                        <span>Name</span>
                        <strong>{user?.name}</strong>
                      </div>
                      <div className="profile-line">
                        <span>Email</span>
                        <strong>{user?.email}</strong>
                      </div>
                      <div className="profile-line">
                        <span>Status</span>
                        <strong>Customer</strong>
                      </div>
                    </div>
                    <div className="account-actions">
                      <Link className="account-link" to="/orders">View Orders</Link>
                      <Link className="account-button" to="/collections">Browse</Link>
                      <button className="account-button" type="button" onClick={handleLogout}>
                        Sign Out
                      </button>
                    </div>
                  </div>

                  <div className="account-card">
                    <h2 className="account-card-title">Need Help?</h2>
                    <p className="account-copy">For order questions, sizing, or product enquiries, contact Yufa directly.</p>
                    <div className="account-support">
                      <a className="support-link" href="mailto:admin@yufacollections.com">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
                          <path d="m22 6-10 7L2 6" />
                        </svg>
                        admin@yufacollections.com
                      </a>
                      <a className="support-link" href="tel:+6588793249">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
                        </svg>
                        +65 8879 3249
                      </a>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="account-card">
                <p className="account-eyebrow">Customer Account</p>
                <h1 className="account-title">Account</h1>
                <p className="account-copy">Sign in to view your orders and keep your details ready for checkout.</p>
                <div className="account-actions">
                  <Link className="account-link" to="/login">Sign In</Link>
                  <Link className="account-button" to="/register">Create Account</Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </StoreLayout>
    </>
  );
}

export default AccountPage;
