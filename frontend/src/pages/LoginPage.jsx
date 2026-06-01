import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/storefront";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid credentials. Please try again.");
        return;
      }

      localStorage.setItem("token", data.token);
      navigate("/admin/products");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Jost:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

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
          overflow-x: hidden;
        }

        .login-page {
          width: 100%;
          min-width: 0;
          min-height: 100vh;
          display: flex;
          background: #f8f5f2;
          font-family: 'Jost', sans-serif;
        }

        .login-left {
          flex: 1 1 auto;
          min-width: 0;
          background: linear-gradient(160deg, #1a0a2e 0%, #3d1a70 50%, #1a0a2e 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .login-left::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 30% 30%, rgba(201, 168, 76, 0.12) 0%, transparent 55%),
            radial-gradient(ellipse at 70% 70%, rgba(120, 60, 200, 0.2) 0%, transparent 55%);
        }

        .login-left-ornament-top,
        .login-left-ornament-bottom {
          position: absolute;
          left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(201, 168, 76, 0.6), transparent);
        }
        .login-left-ornament-top { top: 0; }
        .login-left-ornament-bottom { bottom: 0; }

        .login-left-content {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 40px;
          max-width: 520px;
        }

        .login-logo {
          width: 160px;
          height: auto;
          margin-bottom: 32px;
          filter: drop-shadow(0 4px 24px rgba(201, 168, 76, 0.35));
          animation: logoFloat 4s ease-in-out infinite;
        }

        @keyframes logoFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .login-left-tagline {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 22px;
          font-weight: 300;
          color: rgba(232, 201, 110, 0.8);
          letter-spacing: 0.05em;
          line-height: 1.6;
        }

        .login-left-divider {
          width: 60px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #c9a84c, transparent);
          margin: 24px auto;
        }

        .login-left-caption {
          display: block;
          width: 100%;
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.3);
          text-align: center;
        }

        .login-right {
          flex: 0 0 480px;
          min-width: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 50px;
          background: #fff;
          position: relative;
        }

        .login-right::before {
          content: '';
          position: absolute;
          left: 0; top: 10%; bottom: 10%;
          width: 1px;
          background: linear-gradient(180deg, transparent, rgba(201, 168, 76, 0.4), transparent);
        }

        .login-form-wrap {
          width: 100%;
          max-width: 380px;
        }

        .login-form-header {
          margin-bottom: 40px;
        }

        .login-eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #c9a84c;
          margin-bottom: 12px;
        }

        .login-form-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 38px;
          font-weight: 400;
          color: #1a0a2e;
          line-height: 1.1;
          letter-spacing: -0.01em;
        }

        .login-form-subtitle {
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          font-weight: 300;
          color: rgba(45, 17, 85, 0.5);
          margin-top: 10px;
          letter-spacing: 0.02em;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(45, 17, 85, 0.55);
          font-weight: 500;
        }

        .form-input {
          padding: 14px 18px;
          border: 1px solid rgba(201, 168, 76, 0.25);
          border-radius: 6px;
          font-family: 'Jost', sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: #1a0a2e;
          background: #fdfcfb;
          outline: none;
          transition: all 0.2s ease;
          letter-spacing: 0.02em;
          width: 100%;
          min-width: 0;
        }

        .form-input:focus {
          border-color: #c9a84c;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.1);
        }

        .form-input::placeholder {
          color: rgba(45, 17, 85, 0.25);
        }

        .login-error {
          background: rgba(220, 50, 50, 0.06);
          border: 1px solid rgba(220, 50, 50, 0.2);
          border-radius: 6px;
          padding: 12px 16px;
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          color: #c0392b;
          letter-spacing: 0.02em;
        }

        .login-btn {
          padding: 16px;
          background: linear-gradient(135deg, #2d1155, #4a1d8a);
          color: #e8c96e;
          border: none;
          border-radius: 6px;
          font-family: 'Jost', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 8px;
          position: relative;
          overflow: hidden;
        }

        .login-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(201, 168, 76, 0.15), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .login-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(45, 17, 85, 0.3);
        }

        .login-btn:hover::after {
          opacity: 1;
        }

        .login-btn:active {
          transform: translateY(0);
        }

        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        @media (max-width: 900px) {
          .login-page {
            flex-direction: column;
          }

          .login-left {
            flex: 0 0 auto;
            min-height: 260px;
            padding: 36px 24px;
          }

          .login-left-content {
            padding: 0;
          }

          .login-logo {
            width: 112px;
            margin-bottom: 18px;
          }

          .login-left-tagline {
            font-size: 20px;
            line-height: 1.35;
          }

          .login-left-divider {
            margin: 16px auto;
          }

          .login-right {
            flex: 1 1 auto;
            width: 100%;
            padding: 48px 28px;
          }

          .login-right::before {
            display: none;
          }

          .login-form-wrap {
            max-width: 460px;
            margin: 0 auto;
          }
        }

        @media (max-width: 520px) {
          .login-page {
            background: #fff;
          }

          .login-left {
            min-height: 220px;
            padding: 30px 20px;
          }

          .login-logo {
            width: 92px;
          }

          .login-left-tagline {
            font-size: 18px;
          }

          .login-left-caption {
            font-size: 9px;
            letter-spacing: 0.22em;
          }

          .login-right {
            align-items: flex-start;
            padding: 38px 20px 52px;
          }

          .login-form-header {
            margin-bottom: 30px;
          }

          .login-form-title {
            font-size: clamp(34px, 12vw, 44px);
            line-height: 1.02;
          }

          .login-eyebrow,
          .form-label {
            letter-spacing: 0.18em;
          }

          .login-form {
            gap: 18px;
          }

          .login-btn {
            letter-spacing: 0.22em;
          }
        }
      `}</style>

      <div className="login-page">
        <div className="login-left">
          <div className="login-left-ornament-top" />
          <div className="login-left-content">
            <img src="/images/yufa-logo.png" alt="Yufa Collections" className="login-logo" />
            <div className="login-left-divider" />
            <p className="login-left-tagline">Curated with elegance,<br />crafted with love.</p>
            <div className="login-left-divider" />
            <p className="login-left-caption">Admin Portal</p>
          </div>
          <div className="login-left-ornament-bottom" />
        </div>

        <div className="login-right">
          <div className="login-form-wrap">
            <div className="login-form-header">
              <p className="login-eyebrow">Welcome back</p>
              <h1 className="login-form-title">Sign in to<br />your portal</h1>
              <p className="login-form-subtitle">Manage your collections with ease</p>
            </div>

            <form className="login-form" onSubmit={handleLogin}>
              <div className="form-field">
                <label className="form-label">Email Address</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="admin@yufacollections.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label className="form-label">Password</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <div className="login-error">{error}</div>}

              <button className="login-btn" type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
