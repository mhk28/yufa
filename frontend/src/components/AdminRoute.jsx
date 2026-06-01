import { Navigate } from "react-router-dom";

function getAdminTokenPayload(token) {
  try {
    const payload = token.split(".")[1];
    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(
      normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
      "="
    );
    const decodedPayload = atob(paddedPayload);
    return JSON.parse(decodedPayload);
  } catch {
    return null;
  }
}

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const payload = token ? getAdminTokenPayload(token) : null;
  const isExpired = payload?.exp ? payload.exp * 1000 < Date.now() : true;

  if (!token || payload?.role !== "admin" || isExpired) {
    localStorage.removeItem("token");
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default AdminRoute;
