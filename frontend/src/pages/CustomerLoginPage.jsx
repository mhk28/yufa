import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import StoreLayout from "../components/StoreLayout";
import { useCustomerAuth } from "../context/CustomerAuthContext";

function CustomerLoginPage() {
  const navigate = useNavigate();
  const { login } = useCustomerAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      navigate("/account");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <StoreLayout>
      <AuthPanel
        eyebrow="Customer Login"
        title="Welcome back"
        error={error}
        footer={<span>New here? <Link to="/register">Create an account</Link></span>}
      >
        <form className="auth-form" onSubmit={handleSubmit}>
          <Field label="Email" value={email} onChange={setEmail} type="email" />
          <Field label="Password" value={password} onChange={setPassword} type="password" />
          <button className="auth-button" type="submit">Sign In</button>
        </form>
      </AuthPanel>
    </StoreLayout>
  );
}

export function AuthPanel({ eyebrow, title, children, error, footer }) {
  return (
    <>
      <style>{`
        .auth-page {
          min-height: 70vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 64px 22px;
        }

        .auth-card {
          width: min(480px, 100%);
          background: #fff;
          border: 1px solid rgba(201, 168, 76, 0.16);
          padding: 38px;
          text-align: left;
        }

        .auth-eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #c9a84c;
          margin: 0 0 12px;
        }

        .auth-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 46px;
          font-weight: 300;
          margin: 0 0 28px;
          color: #1a0a2e;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .auth-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .auth-label {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(45, 17, 85, 0.55);
        }

        .auth-input {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid rgba(201, 168, 76, 0.24);
          background: #fdfcfb;
          color: #1a0a2e;
          font-family: 'Jost', sans-serif;
          font-size: 14px;
        }

        .auth-button {
          min-height: 48px;
          border: none;
          background: #2d1155;
          color: #e8c96e;
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          cursor: pointer;
          margin-top: 8px;
        }

        .auth-error {
          padding: 12px 14px;
          margin-bottom: 16px;
          background: rgba(192, 57, 43, 0.06);
          border: 1px solid rgba(192, 57, 43, 0.2);
          color: #c0392b;
          font-family: 'Jost', sans-serif;
          font-size: 13px;
        }

        .auth-footer {
          margin-top: 22px;
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          color: rgba(45, 17, 85, 0.54);
        }

        .auth-footer a {
          color: #2d1155;
        }
      `}</style>
      <section className="auth-page">
        <div className="auth-card">
          <p className="auth-eyebrow">{eyebrow}</p>
          <h1 className="auth-title">{title}</h1>
          {error && <div className="auth-error">{error}</div>}
          {children}
          <p className="auth-footer">{footer}</p>
        </div>
      </section>
    </>
  );
}

export function Field({ label, value, onChange, type = "text" }) {
  return (
    <label className="auth-field">
      <span className="auth-label">{label}</span>
      <input
        className="auth-input"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </label>
  );
}

export default CustomerLoginPage;
