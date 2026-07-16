import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Unauthorized() {
  const { user, ROLE_LABELS } = useAuth();

  return (
    <div className="auth-page">
      <div className="auth-form" style={{ textAlign: "center" }}>
        <div className="unauthorized-icon">🚫</div>
        <h2>Access Denied</h2>
        <p>
          You do not have permission to access this page.
        </p>
        {user && (
          <p className="unauthorized-role">
            Your current role is <strong>{ROLE_LABELS[user.role]}</strong>.
            <br />
            Contact an administrator if you need elevated access.
          </p>
        )}
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
