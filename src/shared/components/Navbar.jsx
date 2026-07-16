import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, ROLE_LABELS } = useAuth();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/setup" || location.pathname === "/register";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (isAuthPage) {
    return (
      <nav className="topbar">
        <Link to="/" className="topbar-brand">
          <svg className="topbar-logo-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="6" width="26" height="36" rx="2" fill="#e94560" />
            <rect x="8" y="10" width="18" height="28" rx="1" fill="#fff" opacity="0.3" />
            <rect x="18" y="6" width="26" height="36" rx="2" fill="#0f3460" />
            <rect x="22" y="10" width="18" height="28" rx="1" fill="#fff" opacity="0.2" />
            <path d="M24 20 L34 20 M24 24 L32 24 M24 28 L30 28" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="13" cy="44" r="2" fill="#f0a500" />
          </svg>
          <span className="topbar-brand-text">Library Management System</span>
        </Link>
      </nav>
    );
  }

  return (
    <nav className="topbar">
      <Link to="/" className="topbar-brand">
        <svg className="topbar-logo-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="6" width="26" height="36" rx="2" fill="#e94560" />
          <rect x="8" y="10" width="18" height="28" rx="1" fill="#fff" opacity="0.3" />
          <rect x="18" y="6" width="26" height="36" rx="2" fill="#0f3460" />
          <rect x="22" y="10" width="18" height="28" rx="1" fill="#fff" opacity="0.2" />
          <path d="M24 20 L34 20 M24 24 L32 24 M24 28 L30 28" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="13" cy="44" r="2" fill="#f0a500" />
        </svg>
        <span className="topbar-brand-text">Library Management System</span>
      </Link>

      {user && (
        <div className="topbar-right">
          <span className="topbar-welcome">
            Welcome, <strong>{user.username}</strong>
          </span>
          {user.role !== "member" && (
            <span className="topbar-role-badge">
              {ROLE_LABELS[user.role]}
            </span>
          )}
          <button className="topbar-logout" onClick={handleLogout}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9" />
            </svg>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
