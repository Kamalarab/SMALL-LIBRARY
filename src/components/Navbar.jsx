import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (isAuthPage) {
    return (
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          Library Manager
        </Link>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Library Manager
      </Link>
      {user && (
        <>
          <div className="navbar-links">
            <Link
              to="/"
              className={location.pathname === "/" ? "active" : ""}
            >
              Home
            </Link>
            <Link
              to="/books"
              className={location.pathname === "/books" ? "active" : ""}
            >
              Books
            </Link>
            <Link
              to="/add"
              className={location.pathname === "/add" ? "active" : ""}
            >
              Add Book
            </Link>
          </div>
          <div className="navbar-user">
            <span className="navbar-username">{user.username}</span>
            <button className="btn-logout" onClick={handleLogout}>  
              Logout
            </button>
          </div>
        </>
      )}
    </nav>
  );
}
