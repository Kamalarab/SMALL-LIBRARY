import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("member");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const { signup, isAdminSetup, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    if (!isAdminSetup()) {
      navigate("/setup", { replace: true });
    }
  }, [isAdminSetup, navigate, logout]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const result = signup(username.trim(), password, role);
    if (result.success) {
      setStep(2);
      setTimeout(() => navigate("/login", { replace: true }), 2000);
    } else {
      setError(result.error);
    }
  };

  if (step === 2) {
    return (
      <div className="auth-page">
        <div className="auth-form setup-success">
          <div className="setup-success-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="30" stroke="#22c55e" strokeWidth="3" fill="#f0fdf4"/>
              <path d="M20 33L28 41L44 25" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2>Account Created</h2>
          <p className="setup-success-text">
            Your {role === "member" ? "Member" : "Librarian"} account is ready. Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-form setup-form">
        <div className="setup-header">
          <div className="setup-logo">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="14" fill="url(#grad)"/>
              <path d="M14 34V18L24 12L34 18V34L24 28L14 34Z" fill="white" fillOpacity="0.9"/>
              <path d="M24 12V28M14 18L24 24L34 18" stroke="white" strokeWidth="1.5" strokeOpacity="0.5"/>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="48" y2="48">
                  <stop stopColor="#667eea"/>
                  <stop offset="1" stopColor="#764ba2"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h2>Create Account</h2>
          <p className="setup-subtitle">Register to access the library system</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>I want to register as</label>
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button
                type="button"
                onClick={() => setRole("member")}
                style={{
                  flex: 1,
                  padding: "12px 8px",
                  border: role === "member" ? "2px solid #667eea" : "2px solid #e2e8f0",
                  borderRadius: 8,
                  background: role === "member" ? "#f0f0ff" : "#fff",
                  cursor: "pointer",
                  textAlign: "center",
                  fontWeight: role === "member" ? 600 : 400,
                  color: role === "member" ? "#667eea" : "#64748b",
                }}
              >
                <div style={{ fontSize: 24 }}>👨‍🎓</div>
                <div style={{ fontSize: 14, marginTop: 4 }}>Member</div>
              </button>
              <button
                type="button"
                onClick={() => setRole("librarian")}
                style={{
                  flex: 1,
                  padding: "12px 8px",
                  border: role === "librarian" ? "2px solid #667eea" : "2px solid #e2e8f0",
                  borderRadius: 8,
                  background: role === "librarian" ? "#f0f0ff" : "#fff",
                  cursor: "pointer",
                  textAlign: "center",
                  fontWeight: role === "librarian" ? 600 : 400,
                  color: role === "librarian" ? "#667eea" : "#64748b",
                }}
              >
                <div style={{ fontSize: 24 }}>📚</div>
                <div style={{ fontSize: 14, marginTop: 4 }}>Librarian</div>
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Choose a strong password"
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
            />
          </div>
          <button type="submit" className="btn btn-primary auth-submit">
            Create Account
          </button>
        </form>

        <p className="login-footer">
          Already have an account? <a href="/login" style={{ color: "#667eea" }}>Sign In</a>
        </p>
      </div>
    </div>
  );
}
