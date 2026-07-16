import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Setup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState(1);
  const { createAdmin, isAdminSetup, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    if (isAdminSetup()) {
      navigate("/login", { replace: true });
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

    const result = createAdmin(username.trim(), password);
    if (result.success) {
      setSuccess("Administrator account created successfully");
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
          <h2>All Set</h2>
          <p className="setup-success-text">
            Your administrator account is ready. Redirecting to login...
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
          <h2>Welcome</h2>
          <p className="setup-subtitle">Create your administrator account to get started</p>
        </div>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleSubmit}>
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
            Create Administrator
          </button>
        </form>
      </div>
    </div>
  );
}
