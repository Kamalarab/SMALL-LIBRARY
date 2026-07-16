import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAdminSetup } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdminSetup()) {
      navigate("/setup", { replace: true });
    }
  }, [isAdminSetup, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    // Small delay for UX feel
    await new Promise((r) => setTimeout(r, 400));

    const result = login(username.trim(), password);
    setIsSubmitting(false);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form login-form">
        <div className="login-header">
          <div className="login-logo">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="14" fill="url(#loginGrad)"/>
              <path d="M14 34V18L24 12L34 18V34L24 28L14 34Z" fill="white" fillOpacity="0.9"/>
              <path d="M24 12V28M14 18L24 24L34 18" stroke="white" strokeWidth="1.5" strokeOpacity="0.5"/>
              <defs>
                <linearGradient id="loginGrad" x1="0" y1="0" x2="48" y2="48">
                  <stop stopColor="#667eea"/>
                  <stop offset="1" stopColor="#764ba2"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h2>Library System</h2>
          <p className="login-subtitle">Sign in to your account</p>
        </div>

        {error && (
          <div className="auth-error">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{marginRight: 6, verticalAlign: -2}}>
              <path d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm-.5 3h1v5h-1V4zm.5 8a.75.75 0 110-1.5.75.75 0 010 1.5z"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoFocus
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="btn-loading">
                <span className="spinner"></span>
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="login-footer">
          Don't have an account? <a href="/register" style={{ color: "#667eea" }}>Sign Up</a>
        </p>
      </div>
    </div>
  );
}
