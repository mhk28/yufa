import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import StoreLayout from "../components/StoreLayout";
import { useCustomerAuth } from "../context/CustomerAuthContext";
import { AuthPanel, Field } from "./CustomerLoginPage";

function CustomerRegisterPage() {
  const navigate = useNavigate();
  const { register } = useCustomerAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await register(name, email, password);
      navigate("/account");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <StoreLayout>
      <AuthPanel
        eyebrow="Create Account"
        title="Join Yufa"
        error={error}
        footer={<span>Already have an account? <Link to="/login">Sign in</Link></span>}
      >
        <form className="auth-form" onSubmit={handleSubmit}>
          <Field label="Name" value={name} onChange={setName} />
          <Field label="Email" value={email} onChange={setEmail} type="email" />
          <Field label="Password" value={password} onChange={setPassword} type="password" />
          <button className="auth-button" type="submit">Create Account</button>
        </form>
      </AuthPanel>
    </StoreLayout>
  );
}

export default CustomerRegisterPage;
